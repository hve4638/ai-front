const fs = require('node:fs');
const path = require('node:path');
const store = require('../store');
const Profiles = require('../profiles');

describe('Profile Prompt Test', () => {
    // 각 테스트는 병렬적으로 실행되므로 각 TestSuite마다 다른 profile 이름을 사용해야 함
    const testPath = path.join(store.path.baseDirectoryPath, 'prompt-profile-test', 'profiles');
    /**
     * @type {Profiles}
     */
    let profiles;

    const ROOT_PROMPTMETADATA = {
        prompts: [

        ]
    }
    beforeAll(() => {
        fs.rmSync(testPath, { recursive: true, force: true });
        fs.mkdirSync(testPath, { recursive: true });
    });
    beforeEach(() => {
        profiles = new Profiles(testPath);
        profiles.createProfile('profile-test');

        const promptPath = path.join(testPath, 'profile-test', 'prompts');
        fs.mkdirSync(promptPath, { recursive: true, force: true });

        const indexPath = path.join(promptPath, 'index.json');
        fs.writeFileSync(indexPath, JSON.stringify(ROOT_PROMPTMETADATA));
    });
    afterEach(() => {
        profiles.deleteProfiles();
    });
    afterAll(() => {
        profiles.deleteProfiles();
    });
    
    test('Read root prompt metadata', () => {
        const profile = profiles.getProfile('profile-test');
        expect(profile.getRootPromptMetadata()).toEqual(ROOT_PROMPTMETADATA);
    });
});