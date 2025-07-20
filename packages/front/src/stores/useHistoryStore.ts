import { create } from 'zustand';
import SessionHistory from '@/features/session-history';
import useProfileAPIStore from './useProfileAPIStore';
import useSessionStore from './useSessionStore';
import useSignalStore from './useSignalStore';

type HistoryStates = {
    container : Record<string, SessionHistory>;
    actions: {
        deleteMessage(historyId: number, origin: 'in' | 'out' | 'both'): Promise<void>;
    };
    get: (sessionId:string) => SessionHistory;
    remove: (sessionId:string) => void;
    clear: () => void;
}

/**
 * 세션 별 historyStore를 관리
 * 
 * history에 대한 캐싱 역할을 수행함
 */
export const useHistoryStore = create<HistoryStates>((set, get)=>({
    container : {},
    actions: {
        deleteMessage: async (historyId:number, origin:'in' | 'out' | 'both') => {
            const { api } = useProfileAPIStore.getState();
            const { last_session_id } = useSessionStore.getState().deps;

            if (!last_session_id) return;

            const { get: getHistory } = get();
            const history = getHistory(last_session_id);

            await api.session(last_session_id).history.deleteMessage(historyId, origin);
            history.evictCache(historyId);
            useSignalStore.getState().signal.refresh_chat_without_scroll();
        }
    },
    get: (sessionId:string) => {
        const { container } = get();
        if (sessionId in container) {
            return container[sessionId];
        }
        else {
            const historyStore = new SessionHistory(sessionId);
            set((state) => ({
                container : {
                    ...state.container,
                    [sessionId] : historyStore,
                },
            }));
            return historyStore;
        }
    },
    remove: (sessionId:string) => {
        const { container } = get();
        const removed = { ...container };

        delete removed[sessionId];
        set({ container : removed, });
    },
    clear: () => set({ container : {} }),
}));

export default useHistoryStore;