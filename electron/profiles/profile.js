const path = require('node:path');
const { HistoryManager } = require('./history');
const ProfileFile = require('./profileFile');

class Profile {
    #profilePath;
    #files = {};
    #history;

    constructor(profilePath) {
        this.#profilePath = profilePath;
        this.#history = new HistoryManager(path.join(profilePath, 'history'));
    }
    
    set(filename, key, value) {
        this.#loadFile(filename);

        this.#files[filename].set(key, value);
    }

    get(filename, key) {
        this.#loadFile(filename);

        return this.#files[filename].get(key);
    }

    get history() {
        return this.#history;
    }


    #loadFile(filename) {
        if (!(filename in this.#files)) {
            const filePath = path.join(this.#profilePath, filename);

            const file = new ProfileFile(filePath);
            file.readFile();
            
            this.#files[filename] = file;
        }

        return this.#files[filename];
    }

    save(filename) {
        if (filename in this.#files) {
            this.#files[filename].writeFile();
        }
    }

    close() {
        this.#history.close();

        this.#history = null;
    }
}

module.exports = Profile;