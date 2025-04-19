import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { HistoryData } from './types'

import useProfileAPIStore from '@/stores/useProfileAPIStore'

interface HistoryFields {
    metadata: Record<number, HistoryMetadata>;
    history: Record<number, HistoryData>;
}

export interface HistoryState extends HistoryFields {
    actions: {
        select: (offset: number, limit: number) => Promise<HistoryData[]>;
        search: () => Promise<HistoryData[]>;
    },
}

export function createHistoryStore(sessionId: string) {
    return create<HistoryState, [['zustand/immer', never]]>(
        immer((set, get) => {
            // const metadata:Record<number, HistoryMetadata> = {};
            // const history:Record<number, HistoryData> = {};

            const setHistoryMetadata = async (next:HistoryMetadata[]) => {
                set(({ metadata }) => {
                    for (const m of next) {
                        metadata[m.id] = m;
                    }
                });
            }
            const setHistory = async (next:HistoryMessage[]) => {
                set(({ history, metadata }) => {
                    for (const m of next) {
                        const meta = metadata[m.id];
                        if (!meta) continue;
            
                        history[m.id] = {
                            id: m.id,
                            requestType: meta.requestType,
                            input: m.input,
                            output: m.output,
                            createdAt: meta.createdAt,
                            bookmark: meta.bookmark,
                        };
                    }
                });
            }
            const loadHistory = async (metadata: HistoryMetadata[]) => {
                const result:(HistoryData|null)[] = [];
                const uncachedId:number[] = [];

                const neededId:Record<number, number> = {};

                const { history : prevHistory } = get();
                for (const i in metadata) {
                    const m = metadata[i];

                    const cached = prevHistory[m.id];
                    if (cached) {
                        result.push(cached);
                    }
                    else {
                        result.push(null);
                        uncachedId.push(m.id);

                        neededId[m.id] = Number(i);
                    }
                }
                
                const { api } = useProfileAPIStore.getState();
                const sessionAPI = api.getSessionAPI(sessionId);
                const messages = await sessionAPI.getHistoryMessage(uncachedId);
                setHistory(messages);
                
                const { history } = get();
                for (const [historyId, index] of Object.entries(neededId)) {
                    result[index] = history[Number(historyId)];
                }

                return result as HistoryData[];
            }

            return {
                metadata: {},
                history: {},

                actions: {
                    select: async (offset: number, limit: number) => {
                        const { api } = useProfileAPIStore.getState();
                        const sessionAPI = api.getSessionAPI(sessionId);
                        const newMetadata = await sessionAPI.getHistoryMetadata(offset, limit);

                        setHistoryMetadata(newMetadata);
                        return loadHistory(newMetadata);
                    },
                    search: async () => {
                        throw new Error('Not implemented');
                    },
                }
            };
        }),
    );
}