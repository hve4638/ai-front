import crypto from 'crypto';
import { CryptError } from './errors';

class AES {
    #keyBuffer:Buffer = Buffer.alloc(0);
    #algorithm:string = '';

    constructor(key: Buffer) {
        this.setKey(key);
    }

    setKey(key: Buffer) {
        if (key.length === 32) {
            this.#algorithm = 'aes-256-cbc';
        }
        else if (key.length === 24) {
            this.#algorithm = 'aes-192-cbc';
        }
        else if (key.length === 16) {
            this.#algorithm = 'aes-128-cbc';
        }
        else {
            throw new Error('Key length must be 16, 24, or 32 bytes long');
        }

        this.#keyBuffer = key;
    }

    encrypt(data: string): { data: string, iv: string } {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.#algorithm, this.#keyBuffer, iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return {
            data: encrypted,
            iv: iv.toString('hex')
        };
    }

    decrypt(data: string, iv: string): string {
        const ivBuffer = Buffer.from(iv, 'hex');
        const decipher = crypto.createDecipheriv(this.#algorithm, this.#keyBuffer, ivBuffer);
        
        let decrypted:string;
        try {
            decrypted = decipher.update(data, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
        }
        catch(e) {
            throw new CryptError('Decrypt failed');
        }
        
        return decrypted;
    }
}

export default AES;