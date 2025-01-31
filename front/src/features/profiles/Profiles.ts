import LocalAPI from 'api/local';
import Profile from './Profile'
import type { IProfile, IProfiles } from './types';

class Profiles implements IProfiles {
    #loaded:boolean = false;
    #profiles:Map<string, Profile> = new Map();

    constructor() {
    }

    async getProfileIds():Promise<string[]> {
        return await LocalAPI.getProfileList();
    }
    async getLastProfile():Promise<string|null> {
        return await LocalAPI.getLastProfile();
    }
    async setLastProfile(id:string|null) {
        await LocalAPI.setLastProfile(id);
    }

    get loaded() {
        return this.#loaded;
    }

    async createProfile():Promise<string> {
        return await LocalAPI.createProfile();
    }

    async getProfile(id:string):Promise<Profile> {
        if (!this.#profiles.has(id)) {
            const profile = new Profile(id);
            await profile.loadMetadata();
            this.#profiles.set(id, profile);
        }
        return this.#profiles.get(id)!;
    }

    deleteProfile(id:string) {
        LocalAPI.deleteProfile(id);
    }
}

export default Profiles;