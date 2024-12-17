import * as fs from 'node:fs';
import * as path from 'node:path';
import ProgramPath from '../features/program-path';
import Profiles from '../features/profiles';

const programPath = new ProgramPath(path.join(process.env['USERPROFILE'] ?? '', 'Documents', 'Afron'));
describe('Profile Prompt Test', () => {
    // 각 TestSuite는 병렬적으로 실행되므로 각 TestSuite마다 다른 profile 이름을 사용해야 함
    const testPath = path.join(programPath.testPath, 'prompt-profile-test', 'profiles');
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
        fs.mkdirSync(promptPath, { recursive: true });

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
        expect(profile.getRootPromptMetadata()).toEqual(JSON.stringify(ROOT_PROMPTMETADATA));
    });
});