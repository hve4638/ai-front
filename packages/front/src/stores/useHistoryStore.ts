import { create } from 'zustand';
import SessionHistory from '@/features/session-history';

type HistoryStates = {
    container : Record<string, SessionHistory>;
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