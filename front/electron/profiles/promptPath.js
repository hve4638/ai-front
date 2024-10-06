const path = require('node:path');

class PromptPath {
    #profilePath;
    #promptsPath;

    constructor(profilePath) {
        this.#profilePath = profilePath;
        this.#promptsPath = path.join(profilePath, 'prompts');
    }
    
    get rootMetadata() {
        return path.join(this.#promptsPath, 'index.json');
    }

    get legacyRootMetadata() {
        return path.join(this.#promptsPath, 'list.json');
    }

    getModuleMetadata(moduleName) {
        return path.join(this.#promptsPath, moduleName, 'index.json');
    }

    getFile(basePath, targetPath) {
        return path.join(this.#promptsPath, basePath, targetPath);
    }
}

module.exports = PromptPath;