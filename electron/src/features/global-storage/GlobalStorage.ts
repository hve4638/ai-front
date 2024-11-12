import * as path from 'node:path';
import JsonStorage from '../json-storage';
import { StorageError } from './errors';

class GlobalStorage {
    private basePath: string;
    private accessibleFiles:Map<string, string> = new Map();
    private storages:Map<string, JsonStorage> = new Map();

    constructor(basePath:string) {
        this.basePath = basePath;
    }

    registerStorage(storageName:string, actualFilePath:string) {
        if (this.accessibleFiles.has(storageName)) {
            throw new StorageError(`Storage '${storageName}' is already registered`);
        }
        
        this.accessibleFiles.set(storageName, actualFilePath);
    }

    isStorageRegistered(filename:string):boolean {
        return this.accessibleFiles.has(filename);
    }

    getValue(storageName:string, key:string) {
        const storage = this.loadStorage(storageName);
        
        return storage.get(key);
    }

    setValue(storageName:string, key:string, value:any) {
        const storage = this.loadStorage(storageName);

        storage.set(key, value);
    }

    removeValue(storageName:string, key:string) {
        const storage = this.loadStorage(storageName);

        storage.remove(key);
    }

    getStorageNames() {
        return Array.from(this.accessibleFiles.keys());
    }

    deleteStorage(storageName:string) {
        const storage = this.loadStorage(storageName);

        storage.deleteFile();

        const storageFilename = this.accessibleFiles.get(storageName)!;
        this.accessibleFiles.delete(storageName);
        this.storages.delete(storageFilename);
    }

    commit() {
        for (const filename of this.storages.keys()) {
            this.storages.get(filename)?.writeFile();
        }
    }
    
    private loadStorage(storageName:string):JsonStorage {
        const storageFilename = this.accessibleFiles.get(storageName);

        if (storageFilename === undefined) {
            throw new StorageError(`Storage '${storageName}' is not registered`);
        }

        let storage = this.storages.get(storageFilename);
        if (storage !== undefined) {
            return storage;
        }

        const filePath = path.join(this.basePath, storageFilename);
        storage = new JsonStorage(filePath);
        storage.readFile();
        
        this.storages.set(storageFilename, storage);
        return storage;
    }
}

export default GlobalStorage;