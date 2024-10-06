const fs = require('node:fs');
const path = require('node:path');
const { HistoryManager } = require('./history');
const ProfileFile = require('./profileFile');
const PromptPath = require('./promptPath');
const { ProfileError } = require('./errors');

class Profile {
    #profilePath;
    #promptPath;
    #files = {};
    #history;

    constructor(profilePath) {
        this.#profilePath = profilePath;
        this.#promptPath = new PromptPath(profilePath);
        this.#history = new HistoryManager(path.join(profilePath, 'history'));
    }

    get history() {
        return this.#history;
    }
    
    setValue(filename, key, value) {
        this.#loadFile(filename);

        this.#files[filename].set(key, value);
    }

    getValue(filename, key) {
        this.#loadFile(filename);

        return this.#files[filename].get(key);
    }

    getRootPromptMetadata() {
        try {
            const targetPath = this.#promptPath.rootMetadata;
            if (fs.existsSync(targetPath)) {
                const data = fs.readFileSync(targetPath, 'utf8');
                return JSON.parse(data);
            }
            else {
                const legacyTargetPath = this.#promptPath.legacyRootMetadata;
                const data = fs.readFileSync(legacyTargetPath, 'utf8');
                return JSON.parse(data);
            }
        }
        catch (e) {
            throw new ProfileError('Failed to get root prompt metadata');
        }
    }

    getModulePromptMetdata() {
        const targetPath = this.#promptPath.getModuleMetadata(moduleName);
        const data = fs.readFileSync(targetPath, 'utf8');
        return JSON.parse(data);
    }

    getPromptTemplate(basePath, targetPath) {
        const target = this.#promptPath.getModuleMetadata(basePath, targetPath);
        return fs.readFileSync(target, 'utf8');
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