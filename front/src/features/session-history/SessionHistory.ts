import { HistoryData } from './types';
import useProfileAPIStore from '@/stores/useProfileAPIStore'

export interface HistoryState {
    select: (offset: number, limit: number) => Promise<HistoryData[]>;
    search: () => Promise<HistoryData[]>;
}

class SessionHistory {
    private metadataCache:Record<number, HistoryMetadata> = {};
    private historyCache:Record<number, HistoryData> = {};

    constructor(private sessionId: string) {}

    private setHistoryMetadata(next:HistoryMetadata[]) {
        for (const m of next) {
            this.metadataCache[m.id] = m;
        }
    }
    private setHistory(next:HistoryMessage[]) {
        for (const m of next) {
            const meta = this.metadataCache[m.id];
            if (!meta) continue;

            this.historyCache[m.id] = {
                id: m.id,
                requestType: meta.requestType,
                input: m.input,
                output: m.output,
                createdAt: meta.createdAt,
                bookmark: meta.bookmark,
                
                rtId: meta.rtId,
                rtUUID: meta.rtUUID,
                modelId: meta.modelId,
            };
        }
    }
    private async loadHistory(next: HistoryMetadata[]) {
        const result:(HistoryData|null)[] = [];
        const uncachedId:number[] = [];

        const neededId:Record<number, number> = {};

        for (const i in next) {
            const m = next[i];

            const cached = this.historyCache[m.id];
            if (cached) {
                result.push(cached);
            }
            else {
                result.push(null);
                uncachedId.push(m.id);

                neededId[m.id] = Number(i);
            }
        }

        if (uncachedId.length === 0) {
            return result as HistoryData[];
        }
        else {
            const { api } = useProfileAPIStore.getState();
            const sessionAPI = api.getSessionAPI(this.sessionId);
            const messages = await sessionAPI.history.getMessage(uncachedId);
            this.setHistory(messages);
            
            for (const [historyId, index] of Object.entries(neededId)) {
                result[index] = this.historyCache[Number(historyId)];
            }
            
            console.log(result);
            return result as HistoryData[];
        }
    }

    async select(offset: number, limit: number) {
        const { api } = useProfileAPIStore.getState();
        const sessionAPI = api.getSessionAPI(this.sessionId);
        const newMetadata = await sessionAPI.history.get(offset, limit);

        console.log(newMetadata);

        this.setHistoryMetadata(newMetadata);
        return this.loadHistory(newMetadata);
    }

    async search(offset: number, limit: number, condition: HistorySearch) {
        const { api } = useProfileAPIStore.getState();
        const sessionAPI = api.getSessionAPI(this.sessionId);
        const newMetadata = await sessionAPI.history.search(offset, limit, condition);

        console.log(newMetadata);

        this.setHistoryMetadata(newMetadata);
        return this.loadHistory(newMetadata);
    }
}

export default SessionHistory;