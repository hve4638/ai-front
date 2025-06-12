import * as fs from 'node:fs';
import * as path from 'node:path';

class ProgramPath {
    #basePath:string;
    constructor(basePath:string) {
        this.#basePath = basePath;
    }

    get basePath() {
        return this.#basePath;
    }

    get profilePath() {
        return path.join(this.#basePath, 'profiles');
    }

    get testPath() {
        return path.join(this.#basePath, 'test');
    }

    get logPath() {
        return path.join(this.#basePath, 'logs');
    }

    makeRequiredDirectory() {
        fs.mkdirSync(this.basePath, { recursive: true });
        fs.mkdirSync(this.profilePath, { recursive: true });
        fs.mkdirSync(this.logPath, { recursive: true });
        // fs.mkdirSync(this.testPath, { recursive: true });
    }
}

export default ProgramPath;