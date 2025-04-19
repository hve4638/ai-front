import { createContext, useState } from 'react';
import { StoreApi, UseBoundStore } from 'zustand';
import { createHistoryStore, HistoryState } from '@/stores/local'
import useSignal from '@/hooks/useSignal';

type HistoryContextProps = {
    refresh: number;
    getHistoryStore: (sessionId:string) => UseBoundStore<StoreApi<HistoryState>>;
}

type HistoryStates = Record<string, UseBoundStore<StoreApi<HistoryState>>>;

export const HistoryContext = createContext<HistoryContextProps|null>(null);

export function HistoryContextProvider({ children }: { children: React.ReactNode }) {
    const [refresh, sendRefresh] = useSignal();
    const [historyStates, setHistoryStates] = useState<HistoryStates>({});
    const getHistoryStore = (sessionId:string) => {
        if (sessionId in historyStates) {
            return historyStates[sessionId];
        }
        else {
            const historyStore = createHistoryStore(sessionId);
            setHistoryStates((prev) => ({
                ...prev,
                [sessionId]: historyStore,
            }));
            return historyStore;
        }
    }

    return (
        <HistoryContext.Provider
            value={{
                refresh,
                getHistoryStore
            }}
        >
            { children }
        </HistoryContext.Provider>
    );
};