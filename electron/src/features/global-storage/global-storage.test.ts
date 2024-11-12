import { aiFrontPath } from '../aifront-path';
import * as fs from 'node:fs';
import * as path from 'node:path';
import GlobalStorage from './GlobalStorage';
import { StorageError } from './errors';

describe('GlobalStorage Test', () => {
    const testDirectory = path.join(aiFrontPath.testDirectoryPath, 'global-storage');
    let globalStorage:GlobalStorage;
    
    beforeAll(() => {
        fs.mkdirSync(testDirectory, { recursive: true });
    });
    beforeEach(() => {
        //fs.mkdirSync(testDirectory, { recursive: true });
        globalStorage = new GlobalStorage(testDirectory);
    });
    afterEach(() => {
        const names = globalStorage.getStorageNames();
        for(const name of names) {
            globalStorage.deleteStorage(name);
        }
    });

    test('access unregistered storage', () => {
        expect(()=>globalStorage.getValue('config', 'value')).toThrow(StorageError)
    });
    test('try accessing registered storage', () => {
        globalStorage.registerStorage('config', 'config.json');
        globalStorage.getValue('config', 'value');
    });
    test('get', () => {
        globalStorage.registerStorage('config', 'config.json');
        const expected = undefined;
        const actual = globalStorage.getValue('config', 'data');
        
        expect(actual).toEqual(expected);
    });
    test('set/get', () => {
        globalStorage.registerStorage('config', 'config.json');
        
        const expectedNumber = 10;
        const expectedString = 'test-data';
        const expectedArray = [1, 2, 3];

        globalStorage.setValue('config', 'data-number', expectedNumber);
        globalStorage.setValue('config', 'data-string', expectedString);
        globalStorage.setValue('config', 'data-array', expectedArray);
        
        expect(
            globalStorage.getValue('config', 'data-number')
        ).toEqual(expectedNumber);
        expect(
            globalStorage.getValue('config', 'data-string')
        ).toEqual(expectedString);
        expect(
            globalStorage.getValue('config', 'data-array')
        ).toEqual(expectedArray);
    });
    test('commit', () => {
        globalStorage.registerStorage('config', 'config.json');
        
        const expectedNumber = 10;
        globalStorage.setValue('config', 'data', expectedNumber);
        globalStorage.commit();

        const jsonData = fs.readFileSync(path.join(testDirectory, 'config.json'), 'utf8');
        const expected = JSON.parse(jsonData);
        const actual = {
            data: 10
        }

        expect(actual).toEqual(expected);
    });
    test('empty storageNames', () => {
        const storageNames = globalStorage.getStorageNames();

        expect(storageNames).toEqual([]);
    });
    test('getStorageNames', () => {
        globalStorage.registerStorage('config', 'config.json');
        globalStorage.registerStorage('data', 'data.json');

        const expected = globalStorage.getStorageNames();
        const actual = ['config', 'data'];
        expected.toSorted();
        actual.toSorted();
        expect(actual).toEqual(actual);
    });
});