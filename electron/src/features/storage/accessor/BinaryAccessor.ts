import * as fs from 'node:fs';
import type { IAccessor } from './types';

class BinaryAccessor implements IAccessor {
    #filePath:string;

    constructor(filePath:string) {
        this.#filePath = filePath;
    }
    
    write(buffer:Buffer) {
        fs.writeFileSync(this.#filePath, buffer);
    }
    read():Buffer {
        if (fs.existsSync(this.#filePath)) {
            return fs.readFileSync(this.#filePath);   
        }
        else {
            return Buffer.from('');
        }
    }
    writeBase64(data:string) {
        const buffer = Buffer.from(data, 'base64');
        this.write(buffer);
    }
    readBase64():string {
        const buffer = this.read();
        return buffer.toString('base64');
    }
    drop() {
        if (fs.existsSync(this.#filePath)) {
            fs.rmSync(this.#filePath, { force: true });
        }
    }
    commit() {
        // nothing to do
    }
}

export default BinaryAccessor;