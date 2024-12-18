import { AccessTree, StorageAccess, NEXT_STORAGE_ACCESS_TYPE_BIT, StorageAccessControlEvent } from './types';
import { IAccessor } from '../accessor';
import { AccessDeniedError, DirectoryAccessError, NotRegisterError, StorageAccessError } from './errors';

const StorageAccessName = {
    [StorageAccess.BINARY] : 'BINARY',
    [StorageAccess.JSON] : 'JSON',
    [StorageAccess.TEXT] : 'TEXT',
} as const;

class StorageAccessControl {
    #events:StorageAccessControlEvent;
    #nextTypeBit:number = NEXT_STORAGE_ACCESS_TYPE_BIT;
    #accessTree:AccessTree = {};

    constructor(events:StorageAccessControlEvent) {
        this.#events = events;
    }

    register(tree:AccessTree) {
        this.#accessTree = tree;
    }
    
    addAccessType():number {
        const typeBit = this.#nextTypeBit;
        if (this.#nextTypeBit >= StorageAccess.ANY) {
            throw new StorageAccessError(`Max access type reached`);
        }
        else {
            this.#nextTypeBit <<= 1;
            return typeBit;
        }
    }
    
    access(identifier:string, accessType:number):IAccessor {
        const identifiers = this.#splitIdentifier(identifier);

        // 접근 권한 확인
        let subtree = this.#accessTree;
        const length = identifiers.length;
        for (let i = 0; i < length-1; i++) {
            subtree = this.#findSubtree(identifiers[i].name, subtree);
        }
        this.#checkIsFileAccessible(identifiers[length-1].name, subtree, accessType);

        // 실제 접근
        for (let i = 0; i < length-1; i++) {
            this.#events.onAccessDir(identifiers[i].full);
        }
        return this.#events.onAccess(identifiers[length-1].full, accessType);
    }

    #findSubtree(dirIdentifier:string, tree:AccessTree) {        
        if (tree[dirIdentifier] != undefined) {
            if (typeof tree[dirIdentifier] === 'number') {
                throw new DirectoryAccessError(`Directory storage '${dirIdentifier}' is not accessible.`);
            }
            else {
                return tree[dirIdentifier];
            }
        }
        else if (tree['**/*'] == undefined) {
            throw new NotRegisterError(`Storage '${dirIdentifier}' is not registered.`);
        }
        else {
            return {
                '**/*' : tree['**/*'],
            };
        }
    }
    
    #checkIsFileAccessible(atomIdentifier:string, tree:AccessTree, accessType:number) {
        const check = (treeItem:number|AccessTree, accessType:number) => {
            if (typeof treeItem === 'object') {
                throw new DirectoryAccessError(`Storage '${atomIdentifier}' is directory.`);
            }
            else if (this.#compareAccessTypes(treeItem, accessType).denied !== 0) {
                throw new AccessDeniedError(`Storage '${atomIdentifier}' is not accessible. '${StorageAccessName[accessType] ?? 'UNKNOWN'}'`);
            }
        }

        if (tree[atomIdentifier] != undefined) {
            check(tree[atomIdentifier], accessType);
        }
        else if (tree['*'] != undefined) {
            check(tree['*'], accessType);
        }
        else if (tree['**/*'] != undefined) {
            check(tree['**/*'], accessType);
        }
        else {
            throw new NotRegisterError(`Storage '${atomIdentifier}' is not registered.`);
        }
    }

    #compareAccessTypes(allowAccessTypes:number, accessTypes:number):{allowed:number, denied:number} {
        const allowed = allowAccessTypes & accessTypes;
        const denied = accessTypes & ~allowed;
        return { allowed, denied };
    }
    
    #splitIdentifier(identifier:string):{name:string, full:string}[] {
        const splitted = identifier.split(':');
        return splitted.map((_: any, index: number) => (
            {
                name : splitted[index],
                full : splitted.slice(0, index + 1).join(':')
            }
        ));
    }
}

export default StorageAccessControl;