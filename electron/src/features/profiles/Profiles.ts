import * as fs from 'node:fs';
import * as path from 'node:path';
import { ACStorage, StorageAccess, JSONType, MemACStorage } from 'ac-storage';
import Profile, { ProfileError } from './Profile';
import runtime from '@/runtime';

const PROFILES_METADATA_PATH = 'profiles.json';
class Profiles {
    #basePath: string | null;
    #storage: ACStorage;
    #profileIdentifiers: string[] = [];
    #lastProfileId: string | null = null;
    #nextProfileId: number = 0;

    static async From(basePath: string | null) {
        const instance = new Profiles(basePath);
        await instance.loadMetadata();
        return instance;
    }

    private constructor(basePath: string | null) {
        this.#basePath = basePath;
        if (basePath === null) {
            this.#storage = new MemACStorage();
        }
        else {
            this.#storage = new ACStorage(basePath);
        }
        this.#storage.register({
            'profiles.json': StorageAccess.JSON({
                'profiles': JSONType.Array(),
                'last_profile': JSONType.String().nullable(),
                'next_profile_id': JSONType.Number(),
            }),
            '*': StorageAccess.Custom('profile'),
        });
        this.#storage.addAccessEvent('profile', {
            async init(fullPath) {
                return Profile.From(fullPath);
            },
            async save(ac) {
                await ac.commit();
            }
        });
    }

    async #acccessAsProfile(identifier: string) {
        return await this.#storage.access(identifier, 'profile') as Profile;
    }

    async loadMetadata() {
        const accessor = await this.#storage.accessAsJSON(PROFILES_METADATA_PATH);
        let {
            profiles, next_profile_id, last_profile
        } = accessor.get('profiles', 'next_profile_id', 'last_profile');

        if (profiles === undefined) {
            runtime.logger.debug(`Profiles metadata not found`);
        }
        profiles ??= [];
        last_profile ??= null;
        next_profile_id ??= 0;

        this.#profileIdentifiers = profiles;
        this.#lastProfileId = last_profile;
        this.#nextProfileId = next_profile_id;

        runtime.logger.info(`Profiles loaded: ${this.#profileIdentifiers.length} profiles`);
    }

    async saveMetadata() {
        const accessor = await this.#storage.accessAsJSON(PROFILES_METADATA_PATH);

        accessor.setOne('profiles', this.#profileIdentifiers);
        accessor.setOne('last_profile', this.#lastProfileId);
        await accessor.save();

        runtime.logger.info(`Profiles saved: ${this.#profileIdentifiers.length} profiles`);
    }

    /**
     * @returns 프로필ID 목록
     */
    getProfileIDs(): string[] {
        return this.#profileIdentifiers;
    }

    async createProfile() {
        const identifier = this.#makeNewProfileId();
        this.#profileIdentifiers.push(identifier);

        const profile = await this.#acccessAsProfile(identifier);
        const sessionId = await profile.sessions.create();
        const ac = await profile.accessAsJSON('config.json')
        ac.setOne('name', 'New Profile');

        await profile.createUsingTemplate({ id: '', name: 'New RT', mode: 'prompt_only' }, 'normal');
        await profile.sessions.setLast(sessionId);

        await this.saveMetadata();

        runtime.logger.info(`Profile created: ${identifier}`);

        return identifier;
    }

    #makeNewProfileId(): string {
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
        this.#profileIdentifiers = this.#profileIdentifiers.filter((id) => id !== identifier);

        const accessor = await this.#acccessAsProfile(identifier);
        await accessor.drop();
        runtime.logger.info(`Profile deleted: ${identifier}`);

        await this.saveMetadata();
    }

    async getProfile(profileId: string): Promise<Profile> {
        if (!this.#existsProfileId(profileId)) {
            throw new ProfileError(`Profile not found '${profileId}'`);
        }
        return await this.#acccessAsProfile(profileId);
    }

    #existsProfileId(identifier: string) {
        return this.#profileIdentifiers.includes(identifier);
    }

    setLastProfileId(id: string | null) {
        if (id === null || this.#existsProfileId(id)) {
            this.#lastProfileId = id;
        }
        else {
            throw new ProfileError(`Profile not found: ${id}`);
        }
    }

    getLastProfileId() {
        if (this.#lastProfileId == null) {
            return null;
        }
        else if (this.#existsProfileId(this.#lastProfileId)) {
            return this.#lastProfileId;
        }
        else {
            return null;
        }
    }

    /**
     * profileId 목록에 없지만 파일시스템 상에 존재하는 프로필의 ID 목록을 반환합니다.
     */
    async getOrphanProfileIds(): Promise<string[]> {
        if (!this.#basePath) return [];
        runtime.logger.debug(`Searching for orphan profiles in ${this.#basePath}...`);

        const profileDirectories = fs.readdirSync(this.#basePath, { withFileTypes: true })
            .filter((dirent) => (
                dirent.isDirectory() &&
                dirent.name.startsWith('profile_') &&
                !this.#existsProfileId(dirent.name) &&
                this.testProfileValidity(dirent.name))
            )
            .map((dirent) => dirent.name);
        return profileDirectories;
    }

    async recoverOrphanProfile(orphanProfileId: string) {
        runtime.logger.trace(`Recovering orphan profile: ${orphanProfileId}`);
        if (this.#existsProfileId(orphanProfileId)) {
            runtime.logger.info(`Skipping recovery for existing profile: ${orphanProfileId}`);
            return;
        }
        if (!this.testProfileValidity(orphanProfileId)) {
            runtime.logger.info(`Failed to recover orphan profile: ${orphanProfileId} (validity check failed)`);
            return;
        }

        this.#profileIdentifiers.push(orphanProfileId);
        await this.saveMetadata();

        runtime.logger.info(`Recovered orphan profile: ${orphanProfileId}`);
    }

    private testProfileValidity = (profileId: string) => {
        runtime.logger.trace(`Checking profile validity: ${profileId}`);
        if (!this.#basePath) {
            runtime.logger.trace(`InMemory mode: skipping profile validity check`);
            return false;
        }

        const profilePath = path.join(this.#basePath, profileId, 'config.json');
        if (!fs.existsSync(profilePath)) {
            runtime.logger.trace(`Profile config file not found: ${profilePath}`);
            return false;
        }
        
        try {
            const profileData = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
            if (!profileData.name) {
                runtime.logger.trace(`Profile config is invalid: missing 'name' field`);
                return false;
            }
        }
        catch (error) {
            runtime.logger.trace(`Error reading profile config: ${error}`);
            return false;
        }

        runtime.logger.trace(`Profile '${profileId}' is valid`);
        return true;
    }


    async saveAll() {
        runtime.logger.info(`Saving all profiles...`);
        await this.saveMetadata();
        await Promise.all(this.#profileIdentifiers.map(async (identifier) => {
            const profile = await this.#acccessAsProfile(identifier);
            return await profile.commit();
        }));
    }
}

export default Profiles;