import * as fs from 'fs';
import * as path from 'path';
import ProgramPath from '../features/program-path';
import Profiles from '../features/profiles';

const programPath = new ProgramPath(path.join(process.env['USERPROFILE'] ?? '', 'Documents', 'Afron'));

const historyData = (id, data) => {
    return {
        id,
        data : `"${data}"`,
    }
}

describe('Profile Test', () => {
    // 각 테스트는 병렬적으로 실행되므로 각 TestSuite마다 다른 profile 이름을 사용해야 함
    const testPath = path.join(programPath.testPath, 'prompt-profile-test', 'profiles');
    /**
     * @type {Profiles}
     */
    let profiles;
    beforeAll(() => {
        fs.rmSync(testPath, { recursive: true, force: true });
        fs.mkdirSync(testPath, { recursive: true });
    });
    beforeEach(() => {
        profiles = new Profiles(testPath);
    });
    afterEach(() => {
        profiles.deleteProfiles();
    });
    afterAll(() => {
        fs.rmSync(testPath, { recursive: true, force: true });
    });

    test('Create Profile', () => {
        let names;
        names = profiles.getProfileNames();
        expect(names).toEqual([]);

        profiles.createProfile('test1');
        names = profiles.getProfileNames();
        expect(names).toEqual(['test1']);
        
        profiles.createProfile('test2');
        names = profiles.getProfileNames();
        expect(names).toEqual(['test1', 'test2']);
    });

    test('Delete Profile', () => {
        let names;
        names = profiles.getProfileNames();
        expect(names).toEqual([]);

        profiles.createProfile('test1');
        profiles.createProfile('test2');
        profiles.createProfile('test3');

        names = profiles.getProfileNames();
        expect(names).toEqual(['test1', 'test2', 'test3']);

        profiles.deleteProfile('test2');
        names = profiles.getProfileNames();
        expect(names).toEqual(['test1', 'test3']);
    });

    test('get/set', () => {
        profiles.createProfile('test1');

        const profile = profiles.getProfile('test1');
        profile.setValue('config.json', 'value', 10);
        
        const value = profile.getValue('config.json', 'value');
        expect(value).toBe(10);
    });

    test('history : get/set', () => {
        profiles.createProfile('test1');

        const profile = profiles.getProfile('test1');
        profile.history.append('#TEST', 'log 1');
        profile.history.append('#TEST', 'log 2');
        profile.history.append('#TEST', 'log 3');
        
        const history = profile.history.get('#TEST', 0, 1000);
        expect(history)
            .toEqual(
                [
                    historyData(3, 'log 3'),
                    historyData(2, 'log 2'),
                    historyData(1, 'log 1'),
                ]
            );
    });

    test('history : get (empty)', () => {
        profiles.createProfile('test');

        const profile = profiles.getProfile('test');
        
        const history = profile.history.get('#TEST', 0, 1000);
        expect(history).toEqual([]);
    });

    test('history : delete', () => {
        profiles.createProfile('test');

        const profile = profiles.getProfile('test');
        profile.history.append('#TEST', 'log 1');
        profile.history.append('#TEST', 'log 2');
        profile.history.append('#TEST', 'log 3');

        let history;
        history = profile.history.get('#TEST', 0, 1000);
        expect(history).toEqual([
            historyData(3, 'log 3'),
            historyData(2, 'log 2'),
            historyData(1, 'log 1'),
        ]);

        profile.history.delete('#TEST', 2);

        history = profile.history.get('#TEST', 0, 1000);
        expect(history).toEqual([
            historyData(3, 'log 3'),
            historyData(1, 'log 1'),
        ]);
    });

    test('history : drop', () => {
        profiles.createProfile('test');

        const profile = profiles.getProfile('test');
        profile.history.append('#TEST', 'log 1');
        profile.history.append('#TEST', 'log 2');
        profile.history.append('#TEST', 'log 3');

        let history;
        history = profile.history.get('#TEST', 0, 1000);
        expect(history).toEqual([
            historyData(3, 'log 3'),
            historyData(2, 'log 2'),
            historyData(1, 'log 1'),
        ]);

        profile.history.drop('#TEST');

        history = profile.history.get('#TEST', 0, 1000);
        expect(history).toEqual([]);
    });
});