import useProfileAPIStore from '@/stores/useProfileAPIStore';
import useCacheStore from '@/stores/useCacheStore';
import useDataStore from '@/stores/useDataStore';
import { ProfileSessionMetadata } from '@/types';

class SessionEvent {
    static async createSession() {
        const { api } = useProfileAPIStore.getState();
        const { update: updateCacheState } = useCacheStore.getState();
        const { refetch: refetchDataState } = useDataStore.getState();

        const sid = await api.sessions.add();
        await Promise.all([
            updateCacheState.last_session_id(sid),
            refetchDataState.sessions(),
        ]);
    }
    static async removeSession(sessionId: string) {
        const { api } = useProfileAPIStore.getState();
        const { sessions } = useDataStore.getState();
        const { update: updateCache, last_session_id } = useCacheStore.getState();
        const { refetch: refetchDataState } = useDataStore.getState();

        const sessionAPI = api.session(sessionId);
        const { delete_lock } = await sessionAPI.get('config.json', ['delete_lock']);
        if (delete_lock) {
            return;
        }

        await api.sessions.remove(sessionId);

        // 세션 0개는 허용되지 않으므로 제거 후 새 세션 생성
        if (sessions.length == 1) {
            await this.createSession();
        }
        // 현재 가르키는 세션 제거 시, 가르키는 세션을 변경
        else if (sessionId === last_session_id) {
            const prevIndex = sessions.indexOf(sessionId);
            if (prevIndex < 0) {
                await updateCache.last_session_id(sessions[0]);
            }
            else if (prevIndex === 0) {
                await updateCache.last_session_id(sessions[1]);
            }
            else {
                await updateCache.last_session_id(sessions[prevIndex - 1]);
            }
        }
        await refetchDataState.sessions();
    }
    static async reorderSessions(sessionIds: string[]) {
        const { api } = useProfileAPIStore.getState();
        const dataState = useDataStore.getState();

        await api.sessions.reorder(sessionIds);
        await dataState.refetch.sessions();
    }
    static async undoRemoveSession() {
        const { api } = useProfileAPIStore.getState();
        const dataState = useDataStore.getState();

        await api.sessions.undoRemoved();
        await dataState.refetch.sessions();
    }
    static async getSessionMetadataList() {
        const { api } = useProfileAPIStore.getState();
        const { sessions } = useDataStore.getState();
        if (sessions == null) {
            return [];
        }

        const promises: ProfileSessionMetadata[] = await Promise.all(
            sessions.map(async (sid) => {
                const sessionAPI = api.session(sid);
                const configPromise = sessionAPI.get('config.json', [
                    'name', 'color', 'delete_lock', 'model_id', 'rt_id'
                ]);
                const cachePromise = sessionAPI.get('cache.json', [
                    'state'
                ]);
                const { name, color, delete_lock, model_id, rt_id } = await configPromise;
                const { state } = await cachePromise;

                let displayName = name;
                if (name == null || name === '') {
                    if (await api.rts.existsId(rt_id)) {
                        const rtAPI = api.rt(rt_id);
                        const {
                            name: rtName,
                        } = await rtAPI.getMetadata();

                        displayName = rtName;
                    }
                    else {
                        displayName = null;
                    }
                }

                return {
                    id: sid,
                    name: name ?? '',
                    displayName: displayName,
                    color: color,
                    deleteLock: delete_lock ?? false,
                    modelId: model_id,
                    rtId: rt_id,
                    state: state ?? 'idle',
                }
            })
        )
        return promises;
    }
}

export default SessionEvent;