import { IPCError } from 'api/error';
import LocalAPI from '@/api/local'
import ProfileAPI from './ProfileAPI'

class ProfilesAPI {
    static #instance:ProfilesAPI|null = null;
    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ProfilesAPI();
        }
        return this.#instance;
    }

    #profiles:Record<string, ProfileAPI> = {};

    private constructor() {}

    async create() { return LocalAPI.profiles.create(); }
    async delete(id:string) { return LocalAPI.profiles.delete(id); }
    async getIds() { return LocalAPI.profiles.getIds(); }
    async getLast() { return LocalAPI.profiles.getLast(); }
    async setLast(id:string|null) { return LocalAPI.profiles.setLast(id); }
    async getOrphanIds() { return LocalAPI.profiles.getOrphanIds(); }
    async recoverOrphan(id:string) {
        try {
            await LocalAPI.profiles.recoverOrphan(id);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    
    /** @deprecated use `profile` instead */
    getProfile(id:string) {
        console.warn('[ProfilesAPI] getProfile() is deprecated, use profile() instead');
        if (!(id in this.#profiles)) {
            this.#profiles[id] = new ProfileAPI(id);
        }
        return this.#profiles[id];
    }
    profile(profileId:string) {
        if (!(profileId in this.#profiles)) {
            this.#profiles[profileId] = new ProfileAPI(profileId);
        }
        return this.#profiles[profileId];
    }

    getMockProfile():ProfileAPI {
        return ProfileAPI.getMock();
    }

    expireCache() {
        this.#profiles = {};
    }
}

export default ProfilesAPI;