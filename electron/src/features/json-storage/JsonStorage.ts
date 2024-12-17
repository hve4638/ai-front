import * as fs from 'node:fs';
import * as path from 'node:path';

class JsonStorage {
    #filePath:string;
    #contents:{[key:string]:any};
    constructor(filePath:string) {
        this.#filePath = filePath;
        this.#contents = {};
    }
    
    readFile() {
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
    writeFile() {
        const jsonString = JSON.stringify(this.#contents, null, 4);

        const dirPath = path.dirname(this.#filePath);
        fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(this.#filePath, jsonString, 'utf8');
    }
    deleteFile() {
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
}

export default JsonStorage;