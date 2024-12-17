import * as fs from 'node:fs';
import * as path from 'node:path';
import { IAccessor, BinaryAccessor, JSONAccessor, TextAccessor } from './accessor';
import { StorageAccessError, StorageError } from './errors';
import StorageAccessControl, { StorageAccess } from './StorageAccessControl';

class Storage {
    #basePath: string;
    #ac:StorageAccessControl;
    #storages:Map<string, IAccessor> = new Map();

    constructor(basePath:string) {
        this.#basePath = basePath;
        this.#ac = new StorageAccessControl({
            onAccess: (access) => {
                if (this.#storages.has(access.identifier)) {
                    return this.#storages.get(access.identifier);
                }
                else {
                    const fullPath = path.join(this.#basePath, access.actualPath);

                    let accessor:IAccessor;
                    switch(access.accessType) {
                        case StorageAccess.JSON:
                            accessor = new JSONAccessor(fullPath);
                            break;
                        case StorageAccess.BINARY:
                            accessor = new BinaryAccessor(fullPath);
                            break;
                        case StorageAccess.TEXT:
                            accessor = new TextAccessor(fullPath);
                            break;
                        default:
                            throw new StorageAccessError('Invalid access type');
                    }
                    
                    this.#storages.set(access.identifier, accessor);
                    return accessor;
                }
            },
            onAccessDir: (access) => {
                const dirPath = path.join(this.#basePath, access.actualPath);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }
            },
            onRegister: (access) => {
                
            },
            onRegisterDir: (access) => {
                
            },
            onDelete: (access) => {
                const accessor = this.#storages.get(access.identifier);
                if (accessor) {
                    accessor.drop();
                    this.#storages.delete(access.identifier);
                }
            },
            onDeleteDir: (access) => {
                const dirPath = path.join(this.#basePath, access.actualPath);
                
                if (fs.existsSync(dirPath)) {
                    fs.rmdirSync(dirPath);
                }
            }
        });
    }

    register(identifier:string, filePath:string, accessType:StorageAccess=StorageAccess.JSON) {
        this.#ac.register(identifier, filePath, accessType);
    }
    registerDir(identifier:string, filePath:string, accessType:number=StorageAccess.ANY) {
        this.#ac.registerDir(identifier, filePath, accessType);
    }

    getRegisteredFiles() {
        return this.#ac.getRegisteredFiles();
    }

    getJSONAccessor(identifier:string):JSONAccessor {
        return this.#loadJSONAccessor(identifier);
    }
    getTextAccessor(identifier:string):TextAccessor {
        return this.#loadTextAccessor(identifier);
    }
    getBinaryAccessor(identifier:string):BinaryAccessor {
        return this.#loadBinaryAccessor(identifier);
    }

    #loadJSONAccessor(identifier:string):JSONAccessor {
        return this.#ac.access(identifier, StorageAccess.JSON) as JSONAccessor;
    }
    #loadBinaryAccessor(identifier:string):BinaryAccessor {
        return this.#ac.access(identifier, StorageAccess.BINARY) as BinaryAccessor;
    }
    #loadTextAccessor(identifier:string):TextAccessor {
        return this.#ac.access(identifier, StorageAccess.TEXT) as TextAccessor;
    }

    dropAccessor(identifier:string) {
        this.#ac.delete(identifier);
    }
    dropDir(identifier:string) {
        this.#ac.delete(identifier, { recursive: true });
    }
    
    dropAllAccessor() {
        const dirs = this.#ac.getRegisteredDirs();

        for (const dir of dirs) {
            this.#ac.delete(dir, { recursive: true });
        }
        
        const files = this.#ac.getRegisteredFiles();
        for (const file of files) {
            this.#ac.delete(file);
        }
    }

    commit() {
        for (const accessor of this.#storages.values()) {
            accessor.commit();
        }
    }
}

export default Storage;