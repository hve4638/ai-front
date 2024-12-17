import * as fs from 'node:fs';
import type { IAccessor } from './types';

class JSONAccessor implements IAccessor {
    #filePath:string;
    #contents:{[key:string]:any};
    constructor(filePath:string) {
        this.#filePath = filePath;
        this.#contents = {};

        this.#readFile();
    }
    
    #readFile() {
        if (fs.existsSync(this.#filePath)) {
            const contents = fs.readFileSync(this.#filePath, 'utf8');
            try {
                this.#contents = JSON.parse(contents);
            }
            catch {
                this.#contents = {};
            }
        }
        else {
            this.#contents = {};
        }
    }
    #writeFile() {
        const jsonString = JSON.stringify(this.#contents, null, 4);

        fs.writeFileSync(this.#filePath, jsonString, 'utf8');
    }
    drop() {
        if (fs.existsSync(this.#filePath)) {
            fs.rmSync(this.#filePath, { force: true });
        }
    }
    set(key:string, value:any) {
        this.#contents[key] = value;
    }
    get(key:string) {
        return this.#contents[key];
    }
    remove(key:string) {
        delete this.#contents[key];
    }
    commit() {
        this.#writeFile();
    }
}

export default JSONAccessor;