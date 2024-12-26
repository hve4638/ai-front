import * as fs from 'node:fs';
import * as path from 'node:path';
import Storage, { StorageAccess } from '../storage'
import HistoryAccessor from './HistoryAccessor';
import { IAccessor } from '../storage/accessor';
import { ProfileError } from './errors';

/**
 * 특정 Profile의 History, Store, Prompt 등을 관리
 */
class Profile implements IAccessor{
    /** Profile 디렉토리 경로 */
    #basePath:string;
    #storage:Storage;
    #histoyAccessBit:number;
    #dropped:boolean = false;

    constructor(profilePath:string) {
        this.#basePath = profilePath;
        fs.mkdirSync(this.#basePath, {recursive: true});

        this.#storage = new Storage(this.#basePath);
        this.#histoyAccessBit = this.#storage.addAccessorEvent({
            create: (fullPath:string) => new HistoryAccessor(fullPath),
        });
        this.#storage.register({
            'prompt' : {
                'index.json' : StorageAccess.JSON,
                '**/*' : StorageAccess.TEXT|StorageAccess.JSON,
            },
            'session' : {
                '*' : {
                    'data.json' : StorageAccess.JSON,
                    'config.json' : StorageAccess.JSON,
                    'cache.json' : StorageAccess.JSON,
                    'history' : this.#histoyAccessBit,
                }
            },
            'shortcut.json' : StorageAccess.JSON,
            'cache.json' : StorageAccess.JSON,
            'data.json' : StorageAccess.JSON,
            'config.json' : StorageAccess.JSON,
            'metadata.json' : StorageAccess.JSON,
            'thumbnail' : StorageAccess.BINARY,
        });
        this.#storage.setAlias('cache', 'cache.json');
        this.#storage.setAlias('data', 'data.json');
        this.#storage.setAlias('config', 'config.json');
        this.#storage.setAlias('metadata', 'metadata.json');
    }
    commit(): void {
        this.#storage.commit();
    }
    drop(): void {
        if (this.dropped) return;
    }
    get dropped(): boolean {
        return this.#dropped;
        fs.rmSync(this.#basePath, {recursive: true});
    }

    createSession():string {
        const data = this.getJSONAccessor('data');
        const cache = this.getJSONAccessor('cache');

        const sessions:string[] = data.get('sessions') ?? [];
        const removedSessions:string[] = cache.get('removed_sessions') ?? [];  
        let num = 0;
        let sid:string;
        while(true) {
            sid = `session_${num}`;
            if (!sessions.includes(sid) && !removedSessions.includes(sid)) {
                sessions.push(sid);
                break;
            }
            num++;
        }
        data.set('sessions', sessions);

        return sid;
    }
    
    removeSession(sid:string) {
        const data = this.getJSONAccessor('data');
        const config = this.getJSONAccessor('config');
        const cache = this.getJSONAccessor('cache');

        let sessions:string[] = data.get('sessions') ?? [];
        if (sessions.includes(sid)) {
            sessions = sessions.filter((s)=>s!==sid);
            data.set('sessions', sessions);

            const removedSessionLimit = config.get('removed_session_limit') ?? 30;
            const removedSessions = cache.get('removed_sessions') ?? [];
            removedSessions.push(sid);
            if (removedSessions.length > removedSessionLimit) {
                const permanentRemoved = removedSessions.splice(0, removedSessions.length - removedSessionLimit);
                for (const item of permanentRemoved) {
                    this.#storage.dropDir(`session:${item}`);
                }
            }
            cache.set('removed_sessions', removedSessions);
        }
        else {
            throw new ProfileError('Invalid session id');
        }
    }

    undoRemoveSession():string|null {
        const data = this.getJSONAccessor('data');
        const cache = this.getJSONAccessor('cache');
        
        const removedSessions:string[] = cache.get('removed_sessions') ?? []
        const lastRemovedSession = removedSessions.pop();
        if (lastRemovedSession) {
            const sessions = data.get('sessions') ?? [];
            sessions.push(lastRemovedSession);
            data.set('sessions', sessions);
            cache.set('removed_sessions', removedSessions);
            return lastRemovedSession;
        }
        else {
            return null;
        }
    }

    permanentRemoveSession(sid:string) {
        const data = this.getJSONAccessor('data');
        const cache = this.getJSONAccessor('cache');

        const sessions = data.get('sessions') ?? [];
        const removedSessions = cache.get('removed_sessions') ?? [];

        const inRemoved = removedSessions.includes(sid);
        const inSessions = sessions.includes(sid);
        if (inRemoved || inSessions) {
            if (inSessions) {
                const filtered = sessions.filter((s)=>s!==sid);
                data.set('sessions', filtered);
            }
            if (inRemoved) {
                const filtered = removedSessions.filter((s)=>s!==sid);
                cache.set('removed_sessions', filtered);
            }

            this.#storage.dropDir(`session:${sid}`);
        }
    }

    removeOrphanSessions() {
        const sessionPath = path.join(this.#basePath, 'session');
        if (!fs.existsSync(sessionPath)) {
             return [];  
        }
        else if (!fs.statSync(sessionPath).isDirectory()) {
            try {
                fs.rmSync(sessionPath, { recursive: true, force : true });
            }
            catch (e) {
                console.error(e);
            }
        }
        else {
            const data = this.getJSONAccessor('data');
            const cache = this.getJSONAccessor('cache');
            const sessions = data.get('sessions');
            const removedSessions = cache.get('removed_sessions');
            
            const items = fs.readdirSync(sessionPath);
            for (const item of items) {
                if (!sessions.includes(item) && !removedSessions.includes(item)) {
                    const dirPath = path.join(this.#basePath, item);
                    fs.rmSync(dirPath, { recursive: true, force : true });
                }
            }
        }
    }

    reorderSessions(newSessionIds:string[]) {
        const data = this.getJSONAccessor('data');

        const prevSet = new Set(data.get('sessions') ?? [])
        const valid = newSessionIds.every((sid)=>prevSet.has(sid));
        if (valid) {
            data.set('sessions', newSessionIds);
        }
    }

    getSessionIds():string[] {
        const data = this.getJSONAccessor('data');
        return data.get('sessions') ?? [];
    }

    getJSONAccessor(identifier:string) {
        return this.#storage.getJSONAccessor(identifier);
    }

    getTextAccessor(identifier:string) {
        return this.#storage.getTextAccessor(identifier);
    }

    getBinaryAccessor(identifier:string) {
        return this.#storage.getBinaryAccessor(identifier);
    }

    getHistoryAccessor(id:string):HistoryAccessor {
        return this.#storage.getAccessor(`history:${id}`, this.#histoyAccessBit) as HistoryAccessor;
    }
}

export default Profile;