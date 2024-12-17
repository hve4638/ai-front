import * as fs from 'node:fs';
import * as path from 'node:path';
import ProgramPath from '../program-path';

import Storage from './Storage';
import { StorageAccess }  from './StorageAccessControl';
import { StorageAccessError, StorageError } from './errors';

const programPath = new ProgramPath(path.join(process.env['USERPROFILE'] ?? '', 'Documents', 'Afron'));

describe('Storage Test', () => {
    const testDirectory = path.join(programPath.testPath, 'storage');
    let storage:Storage;
    
    beforeAll(() => {
        fs.mkdirSync(testDirectory, { recursive: true });
    });
    beforeEach(() => {
        storage = new Storage(testDirectory);
    });
    afterEach(() => {
        storage.dropAllAccessor();
    });

    test('access unregistered storage', () => {
        expect(()=>storage.getTextAccessor('config')).toThrow(StorageAccessError)
    });
    test('access registered storage', () => {
        storage.register('config', 'config.json', StorageAccess.TEXT);
        storage.getTextAccessor('config');
    });
    test('empty storageNames', () => {
        const storageNames = storage.getRegisteredFiles();

        expect(storageNames).toEqual([]);
    });
    test('getStorageNames', () => {
        storage.register('config', 'config.json', StorageAccess.JSON);
        storage.register('data', 'data.json', StorageAccess.JSON);

        const expected = storage.getRegisteredFiles();
        const actual = ['config', 'data'];
        expected.toSorted();
        actual.toSorted();
        expect(actual).toEqual(actual);
    });
});