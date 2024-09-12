const fs = require('node:fs');
const path = require('node:path');
const store = require('../store');
const Profiles = require('../profiles');

const historyData = (id, data) => {
    return {
        id,
        data : `"${data}"`,
    }
}

describe('Profile Test', () => {
    const testPath = path.join(store.path.baseDirectoryPath, 'test', 'profiles');
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
        profiles.deleteProfiles();
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
        profile.set('config.json', 'value', 10);
        
        const value = profile.get('config.json', 'value');
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