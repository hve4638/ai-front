import { create, StoreApi, UseBoundStore } from 'zustand';
import { createHistoryStore, HistoryState } from '@/stores/local'

type HistoryStates = {
    container : Record<string, UseBoundStore<StoreApi<HistoryState>>>,
    get: (sessionId:string) => UseBoundStore<StoreApi<HistoryState>>;
    remove: (sessionId:string) => void;
    clear: () => void;
}

/**
 * 각 세션에 대한 historyStore를 관리
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
            const historyStore = createHistoryStore(sessionId);
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