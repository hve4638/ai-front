import { IPCError } from 'api/error';

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
        const [err, data] = await electron.GetProfileSessionData(this.#profileId, this.#sessionId, accessorId, keys);
        if (err) throw new IPCError(err.message);
        return data;
    }
    async set(accessorId:string, data:KeyValueInput) {
        const [err] = await electron.SetProfileSessionData(this.#profileId, this.#sessionId, accessorId, data);
        if (err) throw new IPCError(err.message);
    }

    /* 히스토리 */
    async getHistory(condition:any) {
        const [err, history] = await electron.GetProfileSessionHistory(this.#profileId, this.#sessionId, condition);
        if (err) throw new IPCError(err.message);

        return history;
    }
    async addHistory(history:any) {
        const [err] = await electron.AddProfileSessionHistory(this.#profileId, this.#sessionId, history);
        if (err) throw new IPCError(err.message);
    }
    async deleteHistory(historyKey:number) {
        const [err] = await electron.DeleteProfileSessionHistory(this.#profileId, this.#sessionId, historyKey);
        if (err) throw new IPCError(err.message);
    }
    async deleteAllHistory() {
        const [err] = await electron.DeleteAllProfileSessionHistory(this.#profileId, this.#sessionId);
        if (err) throw new IPCError(err.message);
    }
}

export default SessionAPI;