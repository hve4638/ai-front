import * as fs from 'node:fs';
import type { IAccessor } from './types';

class TextAccessor implements IAccessor {
    #filePath:string;

    constructor(filePath:string) {
        this.#filePath = filePath;
    }
    
    write(text:string) {
        fs.writeFileSync(this.#filePath, text);
    }
    append(text:string) {
        fs.appendFileSync(this.#filePath, text);
    }
    read():string {
        if (fs.existsSync(this.#filePath)) {
            return fs.readFileSync(this.#filePath).toString();
        }
        else {
            return '';
        }
    }
    drop() {
        if (fs.existsSync(this.#filePath)) {
            fs.rmSync(this.#filePath, { force: true });
        }
    }
    commit() {
        if (!fs.existsSync(this.#filePath)) {
            fs.writeFileSync(this.#filePath, '');
        }
    }
}

export default TextAccessor;