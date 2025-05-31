import LocalAPI from '@/api/local';

const electron = window.electron;

class SessionAPI {
    #profileId:string;
    #sessionId:string;

    constructor(profileId:string, sessionId:string) {
        this.#profileId = profileId;
        this.#sessionId = sessionId;
    }

    get id() {
        return this.#sessionId;
    }

    async get(accessorId:string, keys:string[]) {
        return LocalAPI.profileSessionStorage.get(this.#profileId, this.#sessionId, accessorId, keys);
    }
    async set(accessorId:string, data:KeyValueInput) {
        await LocalAPI.profileSessionStorage.set(this.#profileId, this.#sessionId, accessorId, data);
    }

    async getFormValues(rtId:string) {
        return LocalAPI.profileSession.getFormValues(this.#profileId, this.#sessionId, rtId);
    }
    async setFormValues(rtId:string, data:Record<string, any>) {
        await LocalAPI.profileSession.setFormValues(this.#profileId, this.#sessionId, rtId, data);
    }

    history = {
        get : async (offset:number=0, limit:number=100, desc:boolean) => LocalAPI.profileSessionHistory.get(this.#profileId, this.#sessionId, offset, limit, desc),
        search : async (offset:number=0, limit:number=100, search:HistorySearch) => LocalAPI.profileSessionHistory.search(this.#profileId, this.#sessionId, offset, limit, search),
        getMessage : async (historyIds:number[]) => LocalAPI.profileSessionHistory.getMessage(this.#profileId, this.#sessionId, historyIds),
        delete : async (historyKey:number) => LocalAPI.profileSessionHistory.delete(this.#profileId, this.#sessionId, historyKey),
        deleteAll : async () => LocalAPI.profileSessionHistory.deleteAll(this.#profileId, this.#sessionId),
    }
}

export default SessionAPI;