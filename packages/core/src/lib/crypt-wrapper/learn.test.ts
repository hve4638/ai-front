import crypto from 'crypto';

describe('AES', () => {
    test('scrypt', () => {
        {
            const scrypt = crypto.scryptSync('password', 'salt', 64);
            expect(scrypt.length).toBe(64);
        }
        {
            const scrypt = crypto.scryptSync('password', 'salt', 32);
            expect(scrypt.length).toBe(32);
        }
    });
});