import { IPCError } from 'api/error';

const electron = window.electron;

class RTAPI {
    #profileId: string;
    #rtId: string;

    constructor(profileId:string, rtId:string) {
        this.#profileId = profileId;
        this.#rtId = rtId;
    }

    async setPromptData(promptId:string, data:KeyValueInput) {
        const [err] = await electron.SetProfileRTPromptData(this.#profileId, this.#rtId, promptId, data);
        if (err) throw new IPCError(err.message);
    }
    async getPromptData(promptId:string, keys:string[]) {
        const a = await electron.GetProfileRTPromptData(this.#profileId, this.#rtId, promptId, keys);
        console.log(a);
        const [err, result] = a;
        if (err) throw new IPCError(err.message);
        return result;
    }
    
    async set(accessor:string, data:KeyValueInput) {
        const [err] = await electron.SetProfileRTData(this.#profileId, this.#rtId, accessor, data);
        if (err) throw new IPCError(err.message);
    }
    async get(accessor:string, keys:string[]) {
        const a = await electron.GetProfileRTData(this.#profileId, this.#rtId, accessor, keys);
        console.log(a);
        const [err, result] = a;
        if (err) throw new IPCError(err.message);
        return result;
    }
    async setOne(accessor:string, key:string, value:any) {
        const [err] = await electron.SetProfileRTData(this.#profileId, this.#rtId, accessor, [[key, value]]);
        if (err) throw new IPCError(err.message);
    }
    async getOne(accessor:string, key:string) {
        const [err, result] = await electron.GetProfileRTData(this.#profileId, this.#rtId, accessor, [key]);
        if (err) throw new IPCError(err.message);
        return result[key];
    }

    /**
     * Reflect metadata from RT
     * 
     * 
     */
    async reflectMetadata() {        
        const [err] = await electron.ReflectProfileRTMetadata(this.#profileId, this.#rtId);
        if (err) throw new IPCError(err.message);
    }
}

export default RTAPI;