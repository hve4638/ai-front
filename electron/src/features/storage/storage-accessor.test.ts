import * as fs from 'node:fs';
import * as path from 'node:path';
import ProgramPath from '../program-path';

import Storage from './Storage';
import { StorageAccess }  from './StorageAccessControl';

const programPath = new ProgramPath(path.join(process.env['USERPROFILE'] ?? '', 'Documents', 'Afron'));

describe('Storage Accessor Test', () => {
    const testDirectory = path.join(programPath.testPath, 'storage-accessor');
    let storage:Storage;
    
    beforeAll(() => {
        fs.mkdirSync(testDirectory, { recursive: true });
    });
    beforeEach(() => {
        storage = new Storage(testDirectory);
        storage.registerDir('any', 'any', StorageAccess.ANY);
    });
    afterEach(() => {
        storage.dropAllAccessor();
    });
    
    test('JSONAccessor', () => {
        const accessor = storage.getJSONAccessor('any:config.json');

        expect(accessor.get('key1')).toBeUndefined(); 

        accessor.set('key1', 'value1');
        expect(accessor.get('key1')).not.toBeUndefined();
    });

    test('TextAccessor', () => {
        const accessor = storage.getTextAccessor('any:data.txt');
        
        expect(accessor.read()).toBe('');
        
        const part1 = 'hello';
        const part2 = 'world';
        
        accessor.write(part1);
        expect(accessor.read()).toBe(part1);

        accessor.append(part2);
        expect(accessor.read()).toBe(part1 + part2);
    });

    test('BinaryAccessor', () => {
        const accessor = storage.getBinaryAccessor('any:data.bin');
        
        expect(accessor.read().toString()).toBe('');

        const plainText = 'hello, world!';
        const base64Text = Buffer.from(plainText).toString('base64');
    
        accessor.write(Buffer.from(plainText));
        expect(accessor.readBase64()).toBe(base64Text);
        expect(accessor.read().toString()).toBe(plainText);

        accessor.writeBase64(base64Text);
        expect(accessor.readBase64()).toBe(base64Text);
        expect(accessor.read().toString()).toBe(plainText);
    });
});