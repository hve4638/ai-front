import * as fs from 'node:fs';
import Storage, { StorageAccess } from '../storage'
import HistoryAccessor from './HistoryAccessor';


/**
 * 특정 Profile의 History, Store, Prompt 등을 관리
 */
class Profile {
    /** Profile 디렉토리 경로 */
    #profilePath:string;
    #storage:Storage;
    #histoyAccessBit:number;

    constructor(profilePath:string) {
        this.#profilePath = profilePath;

        this.#storage = new Storage(this.#profilePath);
        this.#histoyAccessBit = this.#storage.addAccessorEvent({
            create: (fullPath:string) => new HistoryAccessor(fullPath),
        });
        this.#storage.register({
            'prompt' : {
                'index.json' : StorageAccess.JSON,
                '**/*' : StorageAccess.TEXT|StorageAccess.JSON,
            },
            'history': {
                '*': this.#histoyAccessBit,
            },
            'cache.json' : StorageAccess.JSON,
            'data.json' : StorageAccess.JSON,
            'config.json' : StorageAccess.JSON,
            'thumbnail' : StorageAccess.BINARY,
        });
    }

    getJSONAccessor(identifier:string) {
        return this.#storage.getJSONAccessor(identifier);
    }

    getTextAccessor(identifier:string) {
        return this.#storage.getTextAccessor(identifier);
    }

    getBinaryAccessor(identifier:string) {
        return this.#storage.getBinaryAccessor(identifier);
    }

    getHistoryAccessor(key:string):HistoryAccessor {
        return this.#storage.getAccessor('history', this.#histoyAccessBit) as HistoryAccessor;
    }

    save() {
        this.#storage.commit();
    }

    delete() {
        fs.rmdirSync(this.#profilePath, {recursive: true});
    }
}

export default Profile;