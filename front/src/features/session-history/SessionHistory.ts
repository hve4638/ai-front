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

    private cacheHistoryMetadata(next:HistoryMetadata[]) {
        const cached = {};

        for (const m of next) {
            cached[m.id] = m;
            this.metadataCache[m.id] = m;
        }

        return cached;
    }
    private cacheHistory(next:HistoryMessage[]):Record<number, HistoryData> {
        const cached = {};

        for (const m of next) {
            const meta = this.metadataCache[m.id];
            const data = {
                id: m.id,
                input: m.input,
                output: m.output,
                
                requestType: meta.requestType,
                createdAt: meta.createdAt,
                bookmark: meta.bookmark,
                
                rtId: meta.rtId,
                rtUUID: meta.rtUUID,
                modelId: meta.modelId,
            };

            cached[m.id] = data;

            if (meta.isComplete) {
                this.historyCache[m.id] = data;
            }
        }
        
        return cached;
    }
    
    /**
     * HistoryMetadata 기반으로 히스토리 데이터 요청
     * 
     * 각 History 로드 시 캐시에 저장하고 이후 캐시된 데이터를 반환
     * 
     * @param next 
     * @returns 
     */
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

        console.group('loadHistory');
        console.log('next: ', next);
        console.log('uncachedId: ', uncachedId);
        console.log('neededId: ', neededId);
        console.groupEnd();
        if (uncachedId.length === 0) {
            console.log('result', result);
            return result as HistoryData[];
        }
        else {
            const { api } = useProfileAPIStore.getState();
            const sessionAPI = api.session(this.sessionId);
            const messages = await sessionAPI.history.getMessage(uncachedId);
            const cache = this.cacheHistory(messages);
            
            for (const [historyId, index] of Object.entries(neededId)) {
                result[index] = cache[Number(historyId)];
            }
            
            console.log('result', result);
            return result as HistoryData[];
        }
    }

    async select(offset: number, limit: number, desc: boolean) {
        const { api } = useProfileAPIStore.getState();
        const sessionAPI = api.session(this.sessionId);
        const newMetadata = await sessionAPI.history.get(offset, limit, desc);
        console.log('select>')

        this.cacheHistoryMetadata(newMetadata);
        return this.loadHistory(newMetadata);
    }

    async search(offset: number, limit: number, condition: HistorySearch) {
        const { api } = useProfileAPIStore.getState();
        const sessionAPI = api.session(this.sessionId);
        const newMetadata = await sessionAPI.history.search(offset, limit, condition);

        console.log(newMetadata);

        this.cacheHistoryMetadata(newMetadata);
        return this.loadHistory(newMetadata);
    }
}

export default SessionHistory;