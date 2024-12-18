import * as fs from 'node:fs';
import * as path from 'node:path';
import ProgramPath from '../../program-path';

import Storage, { StorageAccess, StorageError } from '..';
import { NotRegisterError } from '../access-control';

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
        expect(()=>storage.getTextAccessor('config')).toThrow(NotRegisterError)
    });
    test('access registered storage', () => {
        storage.register({
            'config.json' : StorageAccess.JSON,
        });
        storage.getJSONAccessor('config.json');
    });
});