import * as fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { type IJSONFS } from 'ac-storage';
import AESEncoder from './AESEncoder';

class JSONSecureFS implements IJSONFS {
    #encoder:AESEncoder;
    
    constructor(key:string) {
        this.#encoder = new AESEncoder(key);
    }

    async read(filename:string) {
        if (existsSync(filename)) {
            try {
                const contents = await fs.readFile(filename, 'utf8');
                return this.#encoder.decode(contents);
            }
            catch {
                
            }
        }

        return {}
    }
    async write(filename:string, contents:Record<string, any>) {
        const encrypted = this.#encoder.encode(contents);
        
        await fs.writeFile(filename, encrypted, 'utf8');
    }
    async rm(filename:string) {
        try {
            await fs.rm(filename);
        } catch (error) {
            
        }
    }
    async exists(filename:string) {
        if (!existsSync(filename)) return false;

        return (await fs.stat(filename)).isFile();
    }
}

export default JSONSecureFS;