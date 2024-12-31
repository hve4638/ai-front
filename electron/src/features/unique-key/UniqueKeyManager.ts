import os from 'os';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import si from 'systeminformation';
import { v4 as uuidv4 } from 'uuid';
import { AES } from '../../lib/crypt-wrapper';

const UNIQUE_KEY_VERSION = '0';

class UniqueKeyManager {
    #target:string;
    #dependencyKey:string|null = null;
    #keyPath:string;
    #uniqueKey:string|null = null;

    constructor(target:string) {
        this.#target = target;
        this.#keyPath = path.join(this.#target, 'key');

        fs.mkdirSync(this.#target, { recursive: true });
    }
    #existsKeyFile():boolean {
        return (
            fs.existsSync(this.#keyPath) &&
            fs.statSync(this.#keyPath).isFile()
        );
    }
    #readFile():string {
        return fs.readFileSync(this.#keyPath, 'utf8');
    }
    #writeFile(text:string) {
        fs.writeFileSync(
            this.#keyPath,
            text,
            { encoding: 'utf8' }
        );
    }
    existsKey() {
        return this.#existsKeyFile();
    }
    async generateKey(recoveryKey:string):Promise<string> {
        const dKey = await this.#makeDependencyKey();
        
        const uniqueKey = uuidv4().trim();
        const mainId = this.#encryptKey(uniqueKey, dKey);
        const recoveryId = this.#encryptKey(uniqueKey, recoveryKey);
        
        this.#writeFile(`${mainId}\n${recoveryId}`);
        this.#uniqueKey = uniqueKey;

        return uniqueKey;
    }
    #encryptKey(uniqueKey:string, encKey:string):string {
        const encryptKey = crypto.scryptSync(encKey, 'AFRON', 32);
        const aes = new AES(encryptKey);
        const enc = aes.encrypt(uniqueKey);

        return `${UNIQUE_KEY_VERSION}:${enc.iv}:${enc.data}`;
    }
    #decryptKey(encrypted:string, decKey:string, iv:string):string {
        const decryptKey = crypto.scryptSync(decKey, 'AFRON', 32);
        const aes = new AES(decryptKey);
        return aes.decrypt(encrypted, iv);
    }
    async readKey():Promise<string|null> {
        if (!this.#existsKeyFile()) {
            return null;
        }

        try {
            const dKey = await this.#makeDependencyKey();
            const readed = this.#readFile();

            const [id, recoveryId] = readed.split('\n')
            const splitted = id.split(':');
            const [ver, iv, encrypted] = splitted;
            
            this.#uniqueKey = this.#decryptKey(encrypted, dKey, iv);
            return this.#uniqueKey;
        }
        catch(e) {
            console.error(e);
            return null;
        }
    }
    async tryRecoveryKey(recoveryKey:string):Promise<boolean> {
        if (!this.#existsKeyFile()) {
            return false;
        }
        
        try {
            const readed = this.#readFile();

            const [id, recoveryId] = readed.split('\n')
            const splitted = recoveryId.split(':');
            const [ver, iv, encrypted] = splitted;
            
            const uniqueKey = this.#decryptKey(encrypted, recoveryKey, iv);
            {
                const dKey = await this.#makeDependencyKey();
                const mainId = this.#encryptKey(uniqueKey, dKey);
                const recoveryId = this.#encryptKey(uniqueKey, recoveryKey);
                this.#writeFile(`${mainId}\n${recoveryId}`);
            }
            return true;
        }
        catch(e) {
            return false;
        }
    }
    async #makeDependencyKey() {
        if (this.#dependencyKey != null) {
            return this.#dependencyKey;
        }
        const cpuBrand = (await si.cpu()).brand.trim().replaceAll(' ', '');
        const boardModel = (await si.baseboard()).model.trim().replaceAll(' ', '');
        const hostname = os.hostname();
        
        this.#dependencyKey = `${cpuBrand}:${boardModel}:${hostname}`;
        return this.#dependencyKey;
    }
    getKey():string|null {
        return this.#uniqueKey;
    }
    
}

export default UniqueKeyManager;