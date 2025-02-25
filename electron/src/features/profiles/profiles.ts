import * as fs from 'node:fs';
import * as path from 'node:path';
import { ACStorage, StorageAccess, JSONType } from 'ac-storage';
import { ProfileError } from './Profile';
import Profile from './Profile';

const PROFILES_METADATA_PATH = 'profiles.json';
class Profiles {
    #basePath:string;
    #storage:ACStorage;
    #profileIdentifiers:string[] = [];
    #lastProfileId:string|null = null;
    #nextProfileId:number = 0;

    constructor(basePath:string) {
        this.#basePath = basePath;
        this.#storage = new ACStorage(this.#basePath);
        this.#storage.addAccessEvent('profile', {
            init(fullPath:string) {
                return new Profile(fullPath);
            },
        });
        this.#storage.register({
            'profiles.json' : StorageAccess.JSON({
                'profiles' : JSONType.array,
                'last_profile' : JSONType.string,
            }),
            '*' : StorageAccess.Custom('profile'),
        });

        this.loadMetadata();
    }

    #getProfileAcessor(identifier:string) {
        return this.#storage.getAccessor(identifier, 'profile') as Profile;
    }

    loadMetadata() {
        const accessor = this.#storage.getJSONAccessor(PROFILES_METADATA_PATH);
        
        this.#profileIdentifiers = accessor.getOne('profiles') ?? [];
        this.#lastProfileId = accessor.getOne('last_profile') ?? null;
        this.#nextProfileId = accessor.getOne('next_profile_id') ?? 0;
    }

    saveMetadata() {
        const accessor = this.#storage.getJSONAccessor(PROFILES_METADATA_PATH);
        
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

    createProfile() {
        const identifier = this.#makeNewProfileId();
        this.#profileIdentifiers.push(identifier);

        const profile = this.#getProfileAcessor(identifier);
        profile.getJSONAccessor(PROFILES_METADATA_PATH).setOne('name', 'New Profile');

        return identifier;
    }

    #makeNewProfileId():string {
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

    deleteProfile(identifier: string) {
        const accessor = this.#getProfileAcessor(identifier);
        accessor.drop();
    }

    getProfile(profileId:string):Profile {
        if (!this.#existsProfileId(profileId)) {
            throw new ProfileError(`Profile not found '${profileId}'`);
        }
        return this.#getProfileAcessor(profileId);
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
    
    saveAll() {
        this.saveMetadata();
        this.#profileIdentifiers.forEach((identifier) => {
            const profile = this.#getProfileAcessor(identifier);
            profile.commit();
        });
    }
}

export default Profiles;