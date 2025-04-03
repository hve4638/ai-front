import { IPCError } from 'api/error';
import ProfileAPI from './ProfileAPI'

class ProfilesAPI {
    #profiles:Record<string, ProfileAPI> = {};

    static #instance:ProfilesAPI|null = null;

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ProfilesAPI();
        }
        return this.#instance;
    }

    private constructor() {}

    async getProfileIds() {
        const [err, profiles] = await window.electron.GetProfileList();
        if (err) throw new IPCError(err.message);

        return profiles;
    }
    async getLastProfile() {
        const [err, profile] = await window.electron.GetLastProfile();
        if (err) throw new IPCError(err.message);
    
        return profile;
    }
    async setLastProfile(id:string|null) {
        const [err] = await window.electron.SetLastProfile(id);
        if (err) throw new IPCError(err.message);
    }

    async createProfile() {
        const [err, id] = await window.electron.CreateProfile();
        if (err) throw new IPCError(err.message);
        return id;
    }
    async deleteProfile(id:string) {
       const [err] = await window.electron.DeleteProfile(id);
       if (err) throw new IPCError(err.message);
   }
    async getProfile(id:string):Promise<ProfileAPI> {
        if (!(id in this.#profiles)) {
            this.#profiles[id] = new ProfileAPI(id);
        }
        return this.#profiles[id];
    }
    getMockProfile():ProfileAPI {
        return ProfileAPI.getMock();
    }

    expireCache() {
        this.#profiles = {};
    }
}

export default ProfilesAPI;