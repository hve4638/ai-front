const fs = require('fs');
const path = require('path');
const { ProfileError } = require('./errors')
const Profile = require('./profile');

class Profiles {
    #basePath;
    #metadataPath;

    #metadata;
    /**
     * 메타데이터에서 불러온 프로필 이름 목록
     */
    #profileNames = [];
    /**
     * @type {Object.<string, Profile>}
     * 실제 로드된 프로필
     */
    #profiles = {};

    constructor(basePath) {
        this.#basePath = basePath;
        this.#metadataPath = path.join(this.#basePath, 'profiles.json');

        this.loadProfileMetadata();
    }

    loadProfileMetadata() {
        let loaded = false;

        if (fs.existsSync(this.#metadataPath)) {
            const contents = fs.readFileSync(this.#metadataPath, 'utf8');
            try {
                const metadata = JSON.parse(contents);

                if (!metadata.profiles) {
                    // do nothing
                }
                else {
                    this.#importProfileMetadata(metadata);
                    loaded = true;
                }
            }
            catch {
                loaded = false;
            }
        }
    }

    #importProfileMetadata(metadata) {
        if (Array.isArray(metadata.profiles)) {
            this.#profileNames = metadata.profiles;
        }
        else {
            throw new ProfileError('Invalid metadata');
        }
    }

    saveProfileMetadata() {
        const metadata = this.#exportProfileMetadata();
        const jsonString = JSON.stringify(metadata, null, 4);

        fs.writeFileSync(this.#metadataPath, jsonString, 'utf8');
    }

    /**
     * @returns {Object} profiles.json에 저장할 메타데이터
     */
    #exportProfileMetadata() {
        const metadata = {
            profiles : this.#profileNames,
        }
        return metadata;
    }

    /**
     * @returns {string[]} 프로필 이름 목록
     */
    getProfileNames() {
        return [...this.#profileNames];
    }

    /**
     * 프로필 생성. 이미 존재하는 경우 ProfileError 발생
     * @param {string} profileName 
     */
    createProfile(profileName) {
        if (profileName in this.#profiles) {
            throw new ProfileError('Profile already exists');
        }
        else {
            const profilePath = this.#getProfilePath(profileName);
            const profile = new Profile(profilePath);

            this.#profiles[profileName] = profile;
            this.#profileNames.push(profileName);
        }
        this.saveProfileMetadata();
        
        return this.#profiles[profileName];
    }

    /**
     * 프로필 삭제. 존재하지 않는 경우 ProfileError 발생
     * @param {string} profileName
     * @throws {ProfileError}
    */
    deleteProfile(profileName) {
        const index = this.#profileNames.indexOf(profileName);
        if (index !== -1) {
            const profilePath = this.#getProfilePath(profileName);
            if (profileName in this.#profiles) {
                this.#profiles[profileName].close();

                delete this.#profiles[profileName];
            }

            fs.rmSync(profilePath, { recursive: true, force: true });

            this.#profileNames.splice(index, 1);
            this.saveProfileMetadata();
        }
        else {
            throw new ProfileError('Profile not found');
        }
    }

    #getProfilePath(profileName) {
        return path.join(this.#basePath, profileName);
    }

    /**
     * 프로필 전체 삭제 및 프로필 메타데이터 삭제
     * @param {string} profileName
    */
    deleteProfiles() {
        const names = [...this.#profileNames];
        for (const name of names) {
            this.deleteProfile(name);
        }
        this.#deleteProfileMetadata();
    }
    
    #deleteProfileMetadata() {
        if (fs.existsSync(this.#metadataPath)) {
            fs.unlinkSync(this.#metadataPath);
        }
    }

    /**
     * @param {string} 프로필 이름
     * @returns {Profile} 
     */
    getProfile(profileName) {
        if (profileName in this.#profiles) {
            return this.#profiles[profileName];
        }
        else if (profileName in this.#metadata.profiles) {
            return createProfile(profileName);
        }
        else {
            throw new ProfileError('Profile not found');
        }
    }
    
    saveAll() {
        for (const name in this.#profiles) {
            const profile = this.#profiles[name];
            profile.save();
        }
    }
}

module.exports = Profiles;