import * as fs from 'node:fs';
import * as path from 'node:path';
import ProgramPath from '../program-path';

import { StorageAccess } from './StorageAccessControl';
import Storage from './Storage';

function isFile(filename:string) {
    if (!fs.existsSync(filename)) {
        return false;
    }

    const stat = fs.statSync(filename);
    return stat.isFile();
}
function isDir(dirname:string) {
    if (!fs.existsSync(dirname)) {
        return false;
    }

    const stat = fs.statSync(dirname);
    return stat.isDirectory();
}
function read(filename:string) {
    return fs.readFileSync(filename, 'utf8');
}
function readAsJSON(filename:string) {
    return JSON.parse(read(filename));
}

const programPath = new ProgramPath(path.join(process.env['USERPROFILE'] ?? '', 'Documents', 'Afron'));

describe('Storage FS Test', () => {
    const testDirectory = path.join(programPath.testPath, 'storage-fs');
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

    test('개별파일 Storage FS 연동', () => {
        const configPath = path.join(testDirectory, 'config.json');
        const dataPath = path.join(testDirectory, 'data.txt');
        const verifyState = (expected: { config: boolean, data: boolean }, comment:any='') => {
            const actual = {
                __comment: comment,
                config : isFile(configPath),
                data : isFile(dataPath)
            }
            expect(actual).toEqual({
                __comment: comment,
                ...expected
            });
        };
        
        // 0. 초기 상태
        verifyState({ config: false, data: false }, 0);

        // 1. 저장소 등록
        storage.register('config', 'config.json', StorageAccess.JSON);
        storage.register('data', 'data.txt', StorageAccess.TEXT);
        verifyState({ config: false, data: false }, 1);

        // 2. JSONAccesor 접근
        storage.getJSONAccessor('config');
        storage.commit();
        verifyState({ config: true, data: false }, 3);

        // 4. TextAccessor 접근
        storage.getTextAccessor('data');
        storage.commit();
        verifyState({ config: true, data: true }, 4);

        // 5. 저장소 삭제
        storage.dropAccessor('config');
        verifyState({ config: false, data: true }, 6);
        
        // 6. 저장소 삭제
        storage.dropAccessor('data');
        verifyState({ config: false, data: false }, 7);
    });

    test('디렉토리 Storage FS 연동', () => {
        const baseDirPath = path.join(testDirectory, 'basedir');
        const dataPath = path.join(testDirectory, 'basedir', 'data.txt');
        const configPath = path.join(testDirectory, 'basedir', 'config.json');
        const verifyState = (expected: { base: boolean, data: boolean, config: boolean }, comment:any='') => {
            const actual = {
                __comment: comment,
                base : isDir(baseDirPath),
                data : isFile(dataPath),
                config : isFile(configPath),
            };
            expect(actual).toEqual({
                __comment: comment,
                ...expected
            });
        };
        
        // 0. 초기 상태
        verifyState({ base : false, config: false, data: false }, 0);

        // 1. 저장소 등록
        storage.registerDir('base', 'basedir');
        verifyState({ base : false, config: false, data: false }, 1);

        // 2. 접근
        storage.getJSONAccessor('base:config.json');
        storage.commit();
        verifyState({ base : true, config: true, data: false }, 2);
        
        // 3. 접근
        storage.getTextAccessor('base:data.txt');
        storage.commit();
        verifyState({ base : true, config: true, data: true }, 3);

        // 6. 단일 접근자 삭제 (즉시 파일시스템 반영)
        storage.dropAccessor('base:config.json');
        verifyState({ base : true, config: false, data: true }, 4);
        
        // 7. 디렉토리 저장소 삭제 (즉시 파일시스템 반영)
        storage.dropDir('base');
        verifyState({ base : false, config: false, data: false })
    });
});