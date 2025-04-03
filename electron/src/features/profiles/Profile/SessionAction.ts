import * as fs from 'fs';
import { ACStorage, IACSubStorage } from 'ac-storage';
import { ProfileError } from './errors';

class SessionAction {
    #storage:IACSubStorage;

    /**
     * @param storage 
     */
    constructor(storage:IACSubStorage) {
        this.#storage = storage;
    }

    async #getCacheAccessor() {
        return await this.#storage.accessAsJSON('cache.json');
    }
    async #getDataAccessor() {
        return await this.#storage.accessAsJSON('data.json');
    }
    async #getConfigAccessor() {
        return await this.#storage.accessAsJSON('config.json');
    }
    
    /**
     * 새 세션 생성
    */
    async createSession():Promise<string> {
        const data = await this.#getDataAccessor();
        const cache = await this.#getCacheAccessor();

        const sessions:string[] = data.getOne('sessions') ?? [];
        const removedSessions:string[] = cache.getOne('removed_sessions') ?? []; 
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
        data.setOne('sessions', sessions);

        return sid;
    }
    
    /**
     * 지정 세션 삭제
     * @param sid 
     */
    async removeSession(sid:string) {
        const config = await this.#getConfigAccessor();
        const data = await this.#getDataAccessor();
        const cache = await this.#getCacheAccessor();

        let sessions:string[] = data.getOne('sessions') ?? [];
        if (sessions.includes(sid)) {
            sessions = sessions.filter((s)=>s!==sid);
            data.setOne('sessions', sessions);

            const removedSessionLimit = config.getOne('removed_session_limit') ?? 30;
            const removedSessions = cache.getOne('removed_sessions') ?? [];
            removedSessions.push(sid);
            if (removedSessions.length > removedSessionLimit) {
                const permanentRemoved = removedSessions.splice(0, removedSessions.length - removedSessionLimit);
                for (const item of permanentRemoved) {
                    this.#storage.dropDir(`session:${item}`);
                }
            }
            cache.setOne('removed_sessions', removedSessions);
        }
        else {
            throw new ProfileError('Invalid session id');
        }
    }

    async setSelectedSession(sid:string) {
        const cache = await this.#getCacheAccessor();
        cache.setOne('last_session_id', sid);
    }

    /**
     * 가장 최근에 삭제한 세션을 복구하고 세션 ID를 반환, 복구할 세션이 없으면 null 반환
     * @returns 
     */
    async undoRemoveSession():Promise<string|null> {
        const data = await this.#getDataAccessor();
        const cache = await this.#getCacheAccessor();
        
        const removedSessions:string[] = cache.getOne('removed_sessions') ?? []
        const lastRemovedSession = removedSessions.pop();
        if (lastRemovedSession) {
            const sessions = data.getOne('sessions') ?? [];
            sessions.push(lastRemovedSession);
            data.setOne('sessions', sessions);
            cache.setOne('removed_sessions', removedSessions);
            return lastRemovedSession;
        }
        else {
            return null;
        }
    }

    async permanentRemoveSession(sid:string) {
        const data = await this.#getDataAccessor();
        const cache = await this.#getCacheAccessor();

        const sessions = data.getOne('sessions') ?? [];
        const removedSessions = cache.getOne('removed_sessions') ?? [];

        const inRemoved = removedSessions.includes(sid);
        const inSessions = sessions.includes(sid);
        if (inRemoved || inSessions) {
            if (inSessions) {
                const filtered = sessions.filter((s)=>s!==sid);
                data.setOne('sessions', filtered);
            }
            if (inRemoved) {
                const filtered = removedSessions.filter((s)=>s!==sid);
                cache.setOne('removed_sessions', filtered);
            }

            this.#storage.dropDir(`session:${sid}`);
        }
    }

    async removeOrphanSessions(sessionPath:string) {
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
            const data = await this.#getDataAccessor();
            const cache = await this.#getCacheAccessor();
            const sessions = data.getOne('sessions');
            const removedSessions = cache.getOne('removed_sessions');

            const dirs = fs.readdirSync(sessionPath);
            for (const dir of dirs) {
                if (!sessions.includes(dir) && !removedSessions.includes(dir)) {
                    this.#storage.dropDir(`session:${dir}`);
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
    async reorderSessions(newSessionIds:string[]) {
        const data = await this.#getDataAccessor();

        const prevSet = new Set(data.getOne('sessions') ?? [])
        const valid = newSessionIds.every((sid)=>prevSet.has(sid));
        if (valid) {
            data.setOne('sessions', newSessionIds);
        }
    }

    async getSessionIds():Promise<string[]> {
        const data = await this.#getDataAccessor();
        
        return data.getOne('sessions') ?? [];
    }
}

export default SessionAction;