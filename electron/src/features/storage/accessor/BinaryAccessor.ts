import * as fs from 'node:fs';
import type { IAccessor } from './types';
import { AccessorError } from './errors';

class BinaryAccessor implements IAccessor {
    #filePath:string;
    #dropped:boolean = false;

    constructor(filePath:string) {
        this.#filePath = filePath;
    }
    
    write(buffer:Buffer) {
        this.#ensureNotDropped();
        
        fs.writeFileSync(this.#filePath, buffer);
    }
    read():Buffer {
        this.#ensureNotDropped();
        
        if (fs.existsSync(this.#filePath)) {
            return fs.readFileSync(this.#filePath);   
        }
        else {
            return Buffer.from('');
        }
    }
    writeBase64(data:string) {
        this.#ensureNotDropped();

        const buffer = Buffer.from(data, 'base64');
        this.write(buffer);
    }
    readBase64():string {
        this.#ensureNotDropped();

        const buffer = this.read();
        return buffer.toString('base64');
    }
    drop() {
        this.#ensureNotDropped();

        if (fs.existsSync(this.#filePath)) {
            fs.rmSync(this.#filePath, { force: true });
        }
    }
    commit() {
        this.#ensureNotDropped();
        // nothing to do
    }
    
    get dropped() {
        return this.#dropped;
    }
    #ensureNotDropped() {
        if (this.dropped) {
            throw new AccessorError('The accessor has been dropped');
        }
    }
    
}

export default BinaryAccessor;