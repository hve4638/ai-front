import * as fs from 'node:fs';

/**
 * JSON 형식으로 저장되는 ProfileStore 파일 관리
 */
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

        fs.writeFileSync(this.#filePath, jsonString, 'utf8');
    }
    set(key:string, value:any) {
        this.#contents[key] = value;
    }
    get(key:string) {
        return this.#contents[key];
    }
}

export default JsonStorage;