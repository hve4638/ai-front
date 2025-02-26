import LocalAPI from 'api/local';
import type { IProfileSession } from './types';

class ProfileSession implements IProfileSession {
    #profileId:string;
    #sessionId:string;

    constructor(profileId:string, sessionId:string) {
        this.#profileId = profileId;
        this.#sessionId = sessionId;
    }

    async getData(accessor:string, key:string) {
        return await LocalAPI.getProfileSessionData(this.#profileId, this.#sessionId, accessor, key);
    }
    async setData(accessor:string, key:string, value:any) {
        await LocalAPI.setProfileSessionData(this.#profileId, this.#sessionId, accessor, key, value);
    }

    get id() {
        return this.#sessionId;
    }
}

export default ProfileSession;