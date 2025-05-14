import * as fs from 'node:fs';
import * as path from 'node:path';
import { ACStorage, StorageAccess, JSONType, MemACStorage } from 'ac-storage';
import Profile, { ProfileError } from './Profile';

const PROFILES_METADATA_PATH = 'profiles.json';
class Profiles {
    #basePath:string|null;
    #storage:ACStorage;
    #profileIdentifiers:string[] = [];
    #lastProfileId:string|null = null;
    #nextProfileId:number = 0;

    constructor(basePath:string|null) {
        this.#basePath = basePath;
        if (basePath === null) {
            this.#storage = new MemACStorage();
        }
        else {
            this.#storage = new ACStorage(basePath);
        }
        this.#storage.register({
            'profiles.json' : StorageAccess.JSON({
                'profiles' : JSONType.Array(),
                'last_profile' : JSONType.String().nullable(),
                'next_profile_id' : JSONType.Number(),
            }),
            '*' : StorageAccess.Custom('profile'),
        });
        this.#storage.addAccessEvent('profile', {
            async init(fullPath) {
                return Profile.From(fullPath);
            },
            async save(ac) {
                await ac.commit();
            }
        });

        this.loadMetadata();
    }

    async #acccessAsProfile(identifier:string) {
        return await this.#storage.access(identifier, 'profile') as Profile;
    }
    
    async loadMetadata() {
        const accessor = await this.#storage.accessAsJSON(PROFILES_METADATA_PATH);
        
        this.#profileIdentifiers = accessor.getOne('profiles') ?? [];
        this.#lastProfileId = accessor.getOne('last_profile') ?? null;
        this.#nextProfileId = accessor.getOne('next_profile_id') ?? 0;
    }

    async saveMetadata() {
        console.log('loadMetadata', this.#lastProfileId);
        const accessor = await this.#storage.accessAsJSON(PROFILES_METADATA_PATH);
        
        accessor.setOne('profiles', this.#profileIdentifiers);
        accessor.setOne('last_profile', this.#lastProfileId);
        this.#storage.commit();
    }

    /**
     * @returns 프로필ID 목록
     */
    getProfileIDs():string[] {
        return this.#profileIdentifiers;
    }

    async createProfile() {
        const identifier = this.#makeNewProfileId();
        this.#profileIdentifiers.push(identifier);

        const profile = await this.#acccessAsProfile(identifier);
        const sessionId=  await profile.sessions.create();
        const ac = await profile.accessAsJSON('config.json')
        ac.setOne('name', 'New Profile');

        await profile.createUsingTemplate({ id: '', name : 'New RT', mode: 'prompt_only' }, 'normal');

        await profile.sessions.setLast(sessionId);

        return identifier;
    }

    #makeNewProfileId():string {
        if (this.#basePath === null) {
            return `profile_${this.#nextProfileId++}`;
        }

        while (true) {
            const identifier = `profile_${this.#nextProfileId}`;
            if (this.#existsProfileId(identifier)) {
                this.#nextProfileId += 1;
                continue;
            }
            
            const profilePath = path.join(this.#basePath, `profile_${this.#nextProfileId}`);
            if (fs.existsSync(profilePath)
            && fs.statSync(profilePath).isDirectory()) {
                this.#nextProfileId += 1;
                continue;
            }

            return identifier;
        }
    }

    async deleteProfile(identifier: string) {
        const accessor = await this.#acccessAsProfile(identifier);
        await accessor.drop();
    }

    async getProfile(profileId:string):Promise<Profile> {
        if (!this.#existsProfileId(profileId)) {
            throw new ProfileError(`Profile not found '${profileId}'`);
        }
        return await this.#acccessAsProfile(profileId);
    }

    #existsProfileId(identifier:string) {
        return this.#profileIdentifiers.includes(identifier);
    }
    
    setLastProfileId(id:string|null) {
        if (id === null || this.#existsProfileId(id)) {
            this.#lastProfileId = id;
        }
        else {
            throw new ProfileError(`Profile not found: ${id}`);
        }
    }

    getLastProfileId() {
        return this.#lastProfileId;
    }
    
    async saveAll() {
        this.saveMetadata();
        this.#profileIdentifiers.forEach(async (identifier) => {
            const profile = await this.#acccessAsProfile(identifier);
            await profile.commit();
        });
    }
}

export default Profiles;