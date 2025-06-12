import AES from './AES';
import { CryptError } from './errors';

describe('AES', () => {

    test('encrypt and decrypt', () => {
        const key = Buffer.from('0123456789abcdef0123456789abcdef', 'hex');
        const aes = new AES(key);

        const data = 'hello world';
        const encrypted = aes.encrypt(data);
        const decrypted = aes.decrypt(encrypted.data, encrypted.iv);

        expect(encrypted.data.length).toBe(32);
        expect(decrypted).toBe(data);
    });

    test('block size test', ()=>{
        const key = Buffer.from('0123456789abcdef0123456789abcdef', 'hex');
        const aes = new AES(key);

        const testEncrypt = (data: string, size:number) => {
            const encrypted = aes.encrypt(data);
            expect(encrypted.data.length).toBe(size);
        }

        testEncrypt('', 32);
        testEncrypt('1234567890', 32); // length : 10
        testEncrypt('1234567890ABCDE', 32); // length : 15
        testEncrypt('1234567890ABCDEF', 64); // length : 16
        testEncrypt('1234567890ABCDEF1234567890ABCDE', 64); // length : 31
        testEncrypt('1234567890ABCDEF1234567890ABCDEF', 96); // length : 32
    });

    test('try decrypt', ()=>{
        const key = Buffer.from('0123456789abcdef0123456789abcdef', 'hex');
        const invalidKey = Buffer.from('abcdef0123456789abcdef0123456789', 'hex');
        const aes = new AES(key);

        const data = 'hello world';
        const encrypted = aes.encrypt(data);

        aes.setKey(invalidKey);

        expect(()=>aes.decrypt(encrypted.data, encrypted.iv)).toThrow(CryptError);
    });
});