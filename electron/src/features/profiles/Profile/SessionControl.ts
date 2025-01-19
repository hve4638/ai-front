import * as fs from 'fs';
import * as path from 'path';
import { FSStorage } from '@hve/fs-storage';
import { ProfileError } from './errors';

class SessionControl {
    #storage:FSStorage;

    constructor(storage:FSStorage) {
        this.#storage = storage;
    }
    
    /**
     * 새 세션 생성
    */
    createSession():string {
        const data = this.#storage.getJSONAccessor('data');
        const cache = this.#storage.getJSONAccessor('cache');

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
    
    /**
     * 지정 세션 삭제
     * @param sid 
     */
    removeSession(sid:string) {
        const config = this.#storage.getJSONAccessor('config');
        const data = this.#storage.getJSONAccessor('data');
        const cache = this.#storage.getJSONAccessor('cache');

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
        const data = this.#storage.getJSONAccessor('data');
        const cache = this.#storage.getJSONAccessor('cache');
        
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
        const data = this.#storage.getJSONAccessor('data');
        const cache = this.#storage.getJSONAccessor('cache');

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

    removeOrphanSessions(sessionPath:string) {
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
            const data = this.#storage.getJSONAccessor('data');
            const cache = this.#storage.getJSONAccessor('cache');
            const sessions = data.get('sessions');
            const removedSessions = cache.get('removed_sessions');
            
            /// @TODO : 실제로 작동하는지 확인
            const items = fs.readdirSync(sessionPath);
            for (const item of items) {
                if (!sessions.includes(item) && !removedSessions.includes(item)) {
                    const dirPath = path.join(sessionPath, item);
                    fs.rmSync(dirPath, { recursive: true, force : true });
                }
            }
        }
    }

    /**
     * 세션 순서 재정렬
     * 
     * 세션 순서 변경 시 이전의 세션 아이디가 모두 유지되어야 함
     * @param newSessionIds 
     */
    reorderSessions(newSessionIds:string[]) {
        const data = this.#storage.getJSONAccessor('data');

        const prevSet = new Set(data.get('sessions') ?? [])
        const valid = newSessionIds.every((sid)=>prevSet.has(sid));
        if (valid) {
            data.set('sessions', newSessionIds);
        }
    }

    getSessionIds():string[] {
        const data = this.#storage.getJSONAccessor('data');
        return data.get('sessions') ?? [];
    }
}

export default SessionControl;