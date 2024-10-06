import * as fs from 'node:fs';
import * as path from 'node:path';
import HistoryManager from './history';
import JsonStorage from './JsonStorage';
import PromptPath from './promptPath';
import { ProfileError } from './errors';

/**
 * 특정 Profile의 History, Store, Prompt 등을 관리
 */
class Profile {
    /** Profile 디렉토리 경로 */
    #profilePath:string;
    #promptPath:PromptPath;
    #history:HistoryManager|null;
    #profileStores = {};

    constructor(profilePath:string) {
        this.#profilePath = profilePath;
        this.#promptPath = new PromptPath(profilePath);
        this.#history = new HistoryManager(path.join(profilePath, 'history'));
    }

    get history() {
        return this.#history;
    }
    
    setValue(storeName:string, key:string, value:any) {
        this.#loadStoreFile(storeName);

        this.#profileStores[storeName].set(key, value);
    }

    getValue(storeName:string, key:string) {
        this.#loadStoreFile(storeName);

        return this.#profileStores[storeName].get(key);
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

    getModulePromptMetdata(moduleName:string) {
        const targetPath = this.#promptPath.getModuleMetadata(moduleName);
        const data = fs.readFileSync(targetPath, 'utf8');
        return JSON.parse(data);
    }

    getPromptTemplate(moduleName:string, filename:string) {
        const target = this.#promptPath.getFile(moduleName, filename);
        return fs.readFileSync(target, 'utf8');
    }

    /** ProfileStore를 열기 */
    #loadStoreFile(storeFileName:string):JsonStorage {
        if (!(storeFileName in this.#profileStores)) {
            const filePath = path.join(this.#profilePath, storeFileName);
 
            const file = new JsonStorage(filePath);
            file.readFile();
            
            this.#profileStores[storeFileName] = file;
        }

        return this.#profileStores[storeFileName];
    }

    save() {
        for (const filename in this.#profileStores) {
            this.#profileStores[filename].writeFile();
        }
    }

    close() {
        this.#history?.close();

        this.#history = null;
    }
}

export default Profile;