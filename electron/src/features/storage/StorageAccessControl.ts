import * as path from 'node:path';
import JSONStorage from '../json-storage';
import { StorageAccessError, StorageError } from './errors';

export const StorageAccess = {
    NOTHING : 0b0000_0000,
    BINARY  : 0b0000_0001,
    TEXT    : 0b0000_0010,
    JSON    : 0b0000_0100,
    
    ANY : 0b1111_1111,
} as const;
export type StorageAccess = typeof StorageAccess[keyof typeof StorageAccess];

const StorageAccessName = {
    [StorageAccess.BINARY] : 'BINARY',
    [StorageAccess.JSON] : 'JSON',
    [StorageAccess.TEXT] : 'TEXT',
} as const;


interface DirectoryStorageAccessField {
    identifier : string;
    actualPath : string;
    allowAccessTypes : number;
    dependents : string[];
}

interface FileStorageAccessField {
    identifier : string;
    actualPath : string;
    accessType : StorageAccess;
    dependencies : string[];
}

type StorageAccessControlEvent = {
    onRegister?:(field:FileStorageAccessField)=>void,
    onRegisterDir?:(field:DirectoryStorageAccessField)=>void,
    onAccess?:(field:FileStorageAccessField)=>any,
    onAccessDir?:(field:DirectoryStorageAccessField)=>any,
    onDelete?:(identifier:FileStorageAccessField)=>void,
    onDeleteDir?:(identifier:DirectoryStorageAccessField)=>void,
}

class StorageAccessControl {
    #fileAccessible = new Map<string, FileStorageAccessField>();
    #dirAccessible = new Map<string, DirectoryStorageAccessField>();
    #events:StorageAccessControlEvent;

    constructor(events:StorageAccessControlEvent) {
        this.#events = events;
    }

    register(identifier:string, actualFilePath:string, accessType:StorageAccess=StorageAccess.JSON) {
        if (identifier.includes(':')) {
            throw new StorageAccessError(`Storage name cannot contain ':'`);
        }

        return this.#registerFile(identifier, actualFilePath, accessType);
    }
    #registerFile(identifier:string, actualFilePath:string, accessType:StorageAccess) {
        if (this.#fileAccessible.has(identifier)) {
            throw new StorageAccessError(`Storage '${identifier}' is already registered`);
        }
        
        const access:FileStorageAccessField = {
            identifier : identifier,
            actualPath : actualFilePath,
            accessType : accessType,
            dependencies : [],
        }
        this.#fileAccessible.set(identifier, access);
        this.#events.onRegister?.({...access});

        return access;
    }
    registerDir(identifier:string, actualFilePath:string, allowAccessTypes:number) {
        if (this.#dirAccessible.has(identifier)) {
            throw new StorageAccessError(`Storage '${identifier}' is already registered`);
        }
        else if (identifier.includes(':')) {
            throw new StorageAccessError(`Storage name cannot contain ':'`);
        }
        
        const access:DirectoryStorageAccessField = {
            identifier : identifier,
            actualPath : actualFilePath,
            allowAccessTypes : allowAccessTypes,
            dependents : [],
        }
        this.#dirAccessible.set(identifier, access);

        this.#events.onRegisterDir?.({...access});
        
        return access;
    }
    
    isRegistered(identifier:string) {
        return this.#fileAccessible.has(identifier);
    }
    isDirRegistered(identifier:string) {
        return this.#dirAccessible.has(identifier);
    }

    getRegisteredFiles() {
        return [...this.#fileAccessible.keys()];
    }
    getRegisteredDirs() {
        return [...this.#dirAccessible.keys()];
    }

    access(identifier:string, accessType:StorageAccess) {
        const [dirIdentifier, fileIdentifier] = this.#splitColon(identifier);
        if (dirIdentifier == null) {
            const field = this.#fileAccessible.get(fileIdentifier);
            if (field == undefined) {
                const access = this.#fileAccessible.get(fileIdentifier);
                if (access == undefined) {
                    throw new StorageAccessError(`Storage '${fileIdentifier}' is not registered`);
                }
                else {
                    throw new StorageAccessError(`Directory Storage '${dirIdentifier}' is not directly accessible.`);
                }
            }

            if (field.accessType != accessType) {
                throw new StorageAccessError(`Storage '${dirIdentifier}' is not accessible as '${StorageAccessName[accessType] ?? 'UNKNOWN'}'`);
            }
            
            return this.#events.onAccess?.(field);
        }
        else {
            const dirField = this.#dirAccessible.get(dirIdentifier);
            if (dirField == undefined) {
                throw new StorageAccessError(`Directory Storage '${dirIdentifier}' is not registered`);
            }
            
            if ((dirField.allowAccessTypes & accessType) === 0) {
                throw new StorageAccessError(`Directory Storage '${dirIdentifier}' is not accessible as '${StorageAccessName[accessType] ?? 'UNKNOWN'}'`);
            }
            
            this.#events.onAccessDir?.(dirField);
            
            let fileField = this.#fileAccessible.get(identifier);
            if (fileField == undefined) {
                fileField = this.#registerFile(identifier, path.join(dirField.actualPath, fileIdentifier), accessType);
                fileField.dependencies.push(dirIdentifier);
                dirField.dependents.push(identifier);
            }
            else if (fileField.accessType != accessType) {
                throw new StorageAccessError(`Storage type can't be mixed. '${identifier}' (expected '${StorageAccessName[fileField.accessType] ?? 'UNKNOWN'}', but got '${StorageAccessName[accessType] ?? 'UNKNOWN'}')`);
            }

            return this.#events.onAccess?.(fileField);
        }
    }

    #splitColon(identifier:string):[string|null, string] {
        const index = identifier.indexOf(':');
        if (index === -1) {
            return [null, identifier];
        }
        else {
            return [identifier.substring(0, index), identifier.substring(index + 1)];
        }
    }

    delete(identifier:string, { recursive = false }: { recursive:boolean }= { recursive:false }) {
        const fileAccess = this.#fileAccessible.get(identifier);
        if (fileAccess) {
            fileAccess.dependencies.forEach(dependent => {
                const dirAccess = this.#dirAccessible.get(dependent);
                if (dirAccess) {
                    dirAccess.dependents = dirAccess.dependents.filter(d => d !== identifier);
                }
            });

            this.#events.onDelete?.(fileAccess);
            this.#fileAccessible.delete(identifier);
            return;
        }
        const dirAccess = this.#dirAccessible.get(identifier);
        if (dirAccess) {
            if (!recursive && dirAccess.dependents.length > 0) {
                throw new StorageError(`Directory Storage '${identifier}' has dependents`);
            }
            else {
                const dependents = [...dirAccess.dependents];
                dependents.forEach(dependent => {
                    if (this.#fileAccessible.get(dependent)) {
                        this.delete(dependent, { recursive: true });
                    }
                });

                this.#events.onDeleteDir?.(dirAccess);
                this.#dirAccessible.delete(identifier);
                return;
            }
        }
        
        throw new StorageError(`Storage '${identifier}' is not registered`);
    }
}

export default StorageAccessControl;