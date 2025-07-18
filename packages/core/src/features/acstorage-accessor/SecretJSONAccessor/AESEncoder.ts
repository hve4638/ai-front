import * as fs from 'node:fs';
import crypto from 'crypto';
import { AES } from '@/lib/crypt-wrapper';

class AESEncoder {
    #aes:AES;

    constructor(key:string) {
        const keyBuffer = crypto.scryptSync(key, 'SECRET', 32);

        this.#aes = new AES(keyBuffer);
    }

    encode(obj:Record<string, unknown>):string {
        const { data, iv } = this.#aes!.encrypt(JSON.stringify(obj));
        return `${iv}:${data}`;
    }
    decode(encrypted:string):Record<string, unknown> {
        const [iv, text] = encrypted.split(':');
        return JSON.parse(this.#aes!.decrypt(text, iv));
    }
}

export default AESEncoder;