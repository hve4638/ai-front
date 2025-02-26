import os from 'os';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import si from 'systeminformation';
import { v4 as uuidv4 } from 'uuid';
import { AES } from '../../lib/crypt-wrapper';
import level0 from './level0';

const UNIQUE_KEY_VERSION = '0';

class UniqueKeyManager {
    #target:string;
    #dependencyKey:string|null = null;
    #keyPath:string;
    #uniqueKey:string|null = null;

    constructor(target:string) {
        this.#target = target;
        this.#keyPath = path.join(this.#target, 'key');

        this.initKeyFile();
    }
    protected initKeyFile() {
        fs.mkdirSync(this.#target, { recursive: true });
    }
    protected existsKeyFile():boolean {
        return (
            fs.existsSync(this.#keyPath) &&
            fs.statSync(this.#keyPath).isFile()
        );
    }
    protected readFile():string {
        return fs.readFileSync(this.#keyPath, 'utf8');
    }
    protected writeFile(text:string) {
        fs.writeFileSync(
            this.#keyPath,
            text,
            { encoding: 'utf8' }
        );
    }
    protected deleteKeyFile() {
        fs.unlinkSync(this.#keyPath);
    }
    
    #encryptKey(uniqueKey:string, encKey:string):string {
        switch (UNIQUE_KEY_VERSION) {
            case '0':
            default:
                return level0.encrypt(uniqueKey, encKey);
        }
    }
    #decryptKey(encrypted:string, decKey:string, iv:string):string {
        switch (UNIQUE_KEY_VERSION) {
            case '0':
            default:
                return level0.decrypt(encrypted, decKey, iv);
        }
    }
    /** 하드웨어 종속 키 생성 */
    async #makeDependencyKey() {
        if (this.#dependencyKey != null) {
            return this.#dependencyKey;
        }
        switch (UNIQUE_KEY_VERSION) {
            case '0':
            default:
                return level0.makeDependencyKey();
        }
    }


    existsKey() {
        return this.existsKeyFile();
    }
    async generateKey(recoveryKey:string):Promise<string> {
        const dKey = await this.#makeDependencyKey();
        
        const uniqueKey = uuidv4().trim();
        const mainId = this.#encryptKey(uniqueKey, dKey);
        const recoveryId = this.#encryptKey(uniqueKey, recoveryKey);
        
        this.writeFile(`${mainId}\n${recoveryId}`);
        this.#uniqueKey = uniqueKey;

        return uniqueKey;
    }
    async readKey():Promise<string|null> {
        if (!this.existsKeyFile()) {
            return null;
        }

        try {
            const dKey = await this.#makeDependencyKey();
            const readed = this.readFile();

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
        if (!this.existsKeyFile()) {
            return false;
        }
        
        try {
            const readed = this.readFile();

            const [id, recoveryId] = readed.split('\n')
            const splitted = recoveryId.split(':');
            const [ver, iv, encrypted] = splitted;
            
            const uniqueKey = this.#decryptKey(encrypted, recoveryKey, iv);
            {
                const dKey = await this.#makeDependencyKey();
                const mainId = this.#encryptKey(uniqueKey, dKey);
                const recoveryId = this.#encryptKey(uniqueKey, recoveryKey);
                this.writeFile(`${mainId}\n${recoveryId}`);
            }
            return true;
        }
        catch(e) {
            return false;
        }
    }
    getKey():string|null {
        return this.#uniqueKey;
    }
    resetKey() {
        if (this.existsKeyFile()) {
            this.deleteKeyFile();
        }
    }
}

export default UniqueKeyManager;