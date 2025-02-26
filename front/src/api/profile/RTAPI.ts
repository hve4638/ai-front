import { IPCError } from 'api/error';

const electron = window.electron;

class RTAPI {
    #profileId: string;
    #rtId: string;

    constructor(profileId:string, rtId:string) {
        this.#profileId = profileId;
        this.#rtId = rtId;
    }

    async set(accessor:string, data:[string, any][]) {
        const [err] = await electron.SetProfileRTData(this.#profileId, this.#rtId, accessor, data);
        if (err) throw new IPCError(err.message);
    }

    async get(accessor:string, keys:string[]) {
        const [err] = await electron.GetProfileRTData(this.#profileId, this.#rtId, accessor, keys);
        if (err) throw new IPCError(err.message);
    }

    async setOne(accessor:string, key:string, value:any) {
        const [err] = await electron.SetProfileRTData(this.#profileId, this.#rtId, accessor, [[key, value]]);
        if (err) throw new IPCError(err.message);
    }

    async getOne(accessor:string, key:string) {
        const [err] = await electron.GetProfileRTData(this.#profileId, this.#rtId, accessor, [key]);
        if (err) throw new IPCError(err.message);
    }
}

export default RTAPI;