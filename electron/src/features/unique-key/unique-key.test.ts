import path from 'path';
import UniqueKeyManager from './UniqueKeyManager';
import { personal, localAppdata } from 'win-known-folders';

describe('UniqueKeyManager', () => {
    test('tryRecoveryKey', async () => {
        const target = path.join(localAppdata()!, 'Afron');
        const manager = new UniqueKeyManager(target);

        const expected = await manager.generateKey('RECOVERY_KEY');
        const actual = await manager.readKey();
        
        expect(actual).toBe(expected);
    });
});