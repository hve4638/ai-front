import crypto from 'crypto';
import { AES } from '@/lib/crypt-wrapper';
import { v4 as uuidv4 } from 'uuid';
import { IEncryptModel } from './types';

const MODEL_GEN = 1;
const STATIC_SALT = 'AFRON';
const SIGNITURE = 'AFRON_';
class EncryptModelGen1 implements IEncryptModel {
    async generateKey() {
        return uuidv4().trim();
    }
    
    async encrypt(target:string, encKey:string):Promise<string> {
        const encryptKey = crypto.scryptSync(encKey, STATIC_SALT, 32);
        const aes = new AES(encryptKey);
        const enc = aes.encrypt(`${SIGNITURE}${target}`);
        
        // <버전>:<IV>:<암호화>
        return `${MODEL_GEN}:${enc.iv}:${enc.data}`;
    }

    async decrypt(encryptedData:string, decKey:string):Promise<string> {
        const [genVersion, iv, encrypted] = encryptedData.split(':');
        
        const decryptKey = crypto.scryptSync(decKey, STATIC_SALT, 32);
        const aes = new AES(decryptKey);
        const plainText = aes.decrypt(encrypted, iv);
        if (plainText.startsWith(SIGNITURE)) {
            return plainText.slice(SIGNITURE.length);
        }
        else {
            throw new Error('Invalid data');
        }
    }
}

export default EncryptModelGen1;