import * as fs from 'node:fs';
import * as path from 'node:path';
import { FSStorage, StorageAccess, type IAccessor } from '@hve/fs-storage';
import HistoryAccessor from '../HistoryAccessor';
import SessionControl from './SessionControl';
import { ProfileError } from './errors';

/**
 * 특정 Profile의 History, Store, Prompt 등을 관리
 */
class Profile implements IAccessor{
    /** Profile 디렉토리 경로 */
    #basePath:string;
    #storage:FSStorage;
    #histoyAccessBit:number;
    #sessionControl:SessionControl;
    #dropped:boolean = false;
 
    constructor(profilePath:string) {
        this.#basePath = profilePath;
        fs.mkdirSync(this.#basePath, {recursive: true});

        this.#storage = new FSStorage(this.#basePath);
        this.#histoyAccessBit = this.#storage.addAccessorEvent({
            create: (fullPath:string) => new HistoryAccessor(fullPath),
        });
        this.#storage.register({
            'prompts' : {
                'prompts.json' : StorageAccess.JSON,
                '*' : {
                    'index.json' : StorageAccess.JSON,
                    '*' : StorageAccess.TEXT|StorageAccess.JSON
                }
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
        this.#sessionControl = new SessionControl(this.#storage);
        
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
    get path(): string {
        return this.#basePath;
    }
    get dropped(): boolean {
        return this.#dropped;
        fs.rmSync(this.#basePath, {recursive: true});
    }

    /* 세션 */
    createSession():string {
        return this.#sessionControl.createSession();
    }
    
    removeSession(sid:string) {
        this.#sessionControl.removeSession(sid);
    }

    undoRemoveSession():string|null {
        return this.#sessionControl.undoRemoveSession();
    }

    permanentRemoveSession(sid:string) {
        this.#sessionControl.permanentRemoveSession(sid);
    }

    removeOrphanSessions() {
        const sessionPath = path.join(this.#basePath, 'session');
        
        this.#sessionControl.removeOrphanSessions(sessionPath);
    }

    reorderSessions(newSessionIds:string[]) {
        this.#sessionControl.reorderSessions(newSessionIds);
    }

    getSessionIds():string[] {
        return this.#sessionControl.getSessionIds();
    }

    
    /* 직접 접근 */
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