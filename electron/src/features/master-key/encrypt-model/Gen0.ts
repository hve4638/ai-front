import { v4 as uuidv4 } from 'uuid';
import { IEncryptModel } from './types';

const MODEL_GEN = 1;
class EncryptModelGen0 implements IEncryptModel {
    async generateKey() {
        return uuidv4().trim();
    }
    
    async encrypt(target:string, encKey:string):Promise<string> {
        return `${MODEL_GEN}:${target}`;
    }

    async decrypt(encryptedData:string, decKey:string):Promise<string> {
        const [genVersion, text] = encryptedData.split(':');

        return text;
    }
}

export default EncryptModelGen0;