import os from 'os';
import crypto from 'crypto';
import si from 'systeminformation';

import { AES } from 'lib/crypt-wrapper';

const UNIQUE_KEY_VERSION = 0;

function encryptKey(uniqueKey:string, encKey:string):string {
    const encryptKey = crypto.scryptSync(encKey, 'AFRON', 32);
    const aes = new AES(encryptKey);
    const enc = aes.encrypt(uniqueKey);

    return `${UNIQUE_KEY_VERSION}:${enc.iv}:${enc.data}`;
}
function decryptKey(encrypted:string, decKey:string, iv:string):string {
    const decryptKey = crypto.scryptSync(decKey, 'AFRON', 32);
    const aes = new AES(decryptKey);
    return aes.decrypt(encrypted, iv);
}
async function makeDependencyKey() {
    const cpuBrand = (await si.cpu()).brand.trim().replaceAll(' ', '');
    const boardModel = (await si.baseboard()).model.trim().replaceAll(' ', '');
    const hostname = os.hostname();
    
    return `${cpuBrand}:${boardModel}:${hostname}`;
}

const api = {
    encrypt : encryptKey,
    decrypt : decryptKey,
    makeDependencyKey,
};
export default api;