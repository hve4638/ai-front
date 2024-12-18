import * as fs from 'node:fs';
import * as path from 'node:path';
import { IAccessor, BinaryAccessor, JSONAccessor, TextAccessor } from './accessor';
import StorageAccessControl, { AccessTree, StorageAccess } from './access-control';
import { StorageError } from '.';

type AccessorEvent = {
    create: (fullPath:string)=>IAccessor;
}

class Storage {
    #basePath: string;
    #ac:StorageAccessControl;
    #accessors:Map<string, IAccessor> = new Map();
    #customAccessorEvent: Map<number, AccessorEvent> = new Map();

    constructor(basePath:string) {
        this.#basePath = basePath;
        this.#ac = new StorageAccessControl({
            onAccess: (identifier:string, accessType:StorageAccess) => {
                const targetPath = path.join(this.#basePath, identifier.replaceAll(':', '/'));

                if (this.#accessors.has(identifier)) {
                    return this.#accessors.get(identifier) as IAccessor;
                }
                else {
                    let accessor:IAccessor;
                    switch(accessType) {
                        case StorageAccess.JSON:
                            accessor = new JSONAccessor(targetPath);
                            break;
                        case StorageAccess.BINARY:
                            accessor = new BinaryAccessor(targetPath);
                            break;
                        case StorageAccess.TEXT:
                            accessor = new TextAccessor(targetPath);
                            break;
                        default:
                            const event = this.#customAccessorEvent.get(accessType);
                            if (!event) {
                                throw new StorageError('Invalid access type');
                            }
                            accessor = event.create(targetPath);
                            break;
                    }
                    this.#accessors.set(identifier, accessor);
                    return accessor;
                }
            },
            onAccessDir: (identifier) => {
                const targetPath = identifier.replaceAll(':', '/');

                const dirPath = path.join(this.#basePath, targetPath);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }
            }
        });
    }

    register(tree:AccessTree) {
        this.#ac.register(tree);
    }

    addAccessorEvent(event:AccessorEvent) {
        const customType = this.#ac.addAccessType();
        this.#customAccessorEvent.set(customType, event);

        return customType;
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
    getAccessor(identifier:string, accessType:number):IAccessor {
        return this.#ac.access(identifier, accessType) as IAccessor;
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
        const accessor = this.#accessors.get(identifier)
        if (accessor && !accessor.dropped) {
            accessor.drop();
        }
    }
    
    dropAllAccessor() {
        this.#accessors.forEach((accessor) => {
            if (!accessor.dropped) {
                accessor.drop();
            }
        });
    }

    commit() {
        for (const accessor of this.#accessors.values()) {
            accessor.commit();
        }
    }
}

export default Storage;