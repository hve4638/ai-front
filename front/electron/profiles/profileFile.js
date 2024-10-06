const fs = require('node:fs');

class ProfileFile {
    #filePath;
    #contents;
    constructor(filePath) {
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
        const jsonString = JSON.stringify(contents, null, 4);

        fs.writeFileSync(this.#filePath, jsonString, 'utf8');
    }
    set(key, value) {
        this.#contents[key] = value;
    }
    get(key) {
        return this.#contents[key];
    }
}

module.exports = ProfileFile;