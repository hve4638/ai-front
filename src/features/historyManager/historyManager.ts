import { storeHistory, loadHistory, deleteHistory } from 'services/local/index'
import { ChatSession } from 'context/interface';
import { NOSESSION_KEY } from 'data/constants';
import { APIResponse } from 'data/interface';

interface HistoryCache {
    allFetched: boolean;
    noFetched: boolean;
    data: APIResponse[];
}
export class HistoryManager {
    #caches:{[key:string]:HistoryCache};
    #volatiedKey:{[key:string]:boolean};

    constructor() {
        this.#caches = {};
        this.#volatiedKey = {}
    }

    #getKey(session:ChatSession) {
        return (session.id >= 0 && session.historyIsolation) ? session.id : NOSESSION_KEY;
    }

    #getCache(key) {
        if (!(key in this.#caches)) {
            this.#caches[key] = {
                allFetched : false,
                noFetched : true,
                data : []
            }
            if (this.#isVolatieHistory(key)) {
                this.#caches[key].allFetched = true;
                deleteHistory(key);
            }
        }
        
        return this.#caches[key];
    }

    #isVolatieHistory(key) {
        return this.#volatiedKey[key] ?? false
    }

    async load(session:ChatSession, offset=0, limit=10) {
        const historyKey = this.#getKey(session);
        const cache = this.#getCache(historyKey);

        cache.noFetched = false;
        if (!cache.allFetched && offset + limit >= cache.data.length) {
            const rows = await loadHistory(historyKey, offset, limit);
            console.log('rows')
            console.log(rows)
            const loaded = rows.map((row) => JSON.parse(row.data));
            console.log(loaded)

            if (rows.length !== limit) {
                cache.allFetched = true;
            }

            cache.data = [...cache.data, ...loaded]
        }
        
        return cache.data.slice(offset, offset+limit);
    }

    insert(session:ChatSession, data:APIResponse) {
        const historyKey = this.#getKey(session);
        const cache = this.#getCache(historyKey);
        if (!cache.noFetched) {
            cache.data.unshift(data);
        }

        if (!this.#isVolatieHistory(historyKey)) {
            storeHistory(historyKey, data);
        }
    }

    setHistoryVolatile(key, isVolatile) {
        this.#volatiedKey[key] = isVolatile;
    }

    close() {
        for (const key in this.#volatiedKey) {
            if (this.#volatiedKey[key]) {
                deleteHistory(key)
            }
        }
    }
}