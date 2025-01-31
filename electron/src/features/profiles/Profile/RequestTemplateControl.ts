import { IJSONAccessor, type FSStorage } from '@hve/fs-storage';
import { ProfileError } from './errors';

class RequestTemplateControl {
    #storage:FSStorage;
    #tree:RTMetadataTree;
    #rtIds:string[];
    #lastNewRTIdIndex:number = 0;
    #loaded:boolean = false;

    constructor(storage:FSStorage) {
        this.#storage = storage;
        this.#tree = [];
        this.#rtIds = [];
    }

    #loadData() {
        if (this.#loaded) return;
        const prompts = this.#storage.getJSONAccessor('request-template:index.json');
        this.#tree = prompts.get('tree') ?? [];
        this.#rtIds = prompts.get('ids') ?? [];

        this.#loaded = true;
    }

    #storeData() {
        const prompts = this.#storage.getJSONAccessor('request-template:index.json');
        prompts.set('tree', this.#tree);
        prompts.set('ids', this.#rtIds);
    }

    #getRTIds(tree:RTMetadataTree) {
        let promptIds:string[] = [];
        for(const item of tree) {
            if (item.type === 'directory') {
                item.children.forEach((child)=>{
                    promptIds.push(child.id);
                });
            }
            else {
                promptIds.push(item.id);
            }
        }

        return promptIds;
    }

    #hasId(rtId:string):boolean {
        return this.#rtIds.includes(rtId);
    }
    
    getTree():RTMetadataTree {
        this.#loadData();
        
        return this.#tree;
    }
    
    updateTree(newTree:RTMetadataTree) {
        this.#loadData();
        
        this.#tree = newTree;
        const prevIds = this.#getRTIds(this.#tree);
        const newIds = this.#getRTIds(newTree);

        for (const id of newIds) {
            if (!prevIds.includes(id)) {
                throw invalidRTIdError(id);
            }
        }
        this.#tree = newTree;
        this.#storeData();
    }
    
    addRT(metadata:RTMetadata) {
        this.#loadData();

        if (this.#hasId(metadata.id)) {
            throw rtIdAlreadyExistsError(metadata.id);
        }

        this.#rtIds.push(metadata.id);
        this.#tree.push(metadata);
        this.#storeData();
    }

    removeRT(rtId:string) {
        this.#loadData();
        
        if (!this.#hasId(rtId)) {
            throw invalidRTIdError(rtId);
        }
        const newTree = this.#removeRTTreeAsId(this.#tree, rtId);

        this.#tree = newTree;
        this.#rtIds = this.#rtIds.filter((id)=>(id !== rtId));
        this.#storeData();
    }

    changeId(oldRTId:string, newRTId:string) {
        this.#loadData();
        
        if (!this.#hasId(oldRTId)) throw invalidRTIdError(oldRTId);
        if (this.#hasId(newRTId)) throw rtIdAlreadyExistsError(newRTId);

        const metadata = this.#findRTMetadata(this.#tree, oldRTId);
        if (metadata) {
            metadata.id = newRTId;
            
            const newIds = this.#rtIds.filter((id)=>(id !== oldRTId));
            newIds.push(newRTId);
            this.#rtIds = newIds;
        }

        this.#storeData();
    }

    hasId(rtId:string):boolean {
        this.#loadData();
        return this.#hasId(rtId);
    }

    generateId():string {
        this.#loadData();
        
        let rtId:string;
        let index = this.#lastNewRTIdIndex;
        do {
            rtId = `rt-${index++}`;
        } while (this.#hasId(rtId));
        
        this.#lastNewRTIdIndex = index;
        return rtId;
    }

    #findRTMetadata(tree:RTMetadataTree, rtId:string):RTMetadata|null {
        const item = tree.find((item)=>(item.type !== 'directory' && item.id === rtId));
        if (item) {
            return item as RTMetadata;
        }

        for (const index in tree) {
            if (tree[index].type === 'directory') {
                const filtered = tree[index].children.find((item)=>(item.id !== rtId));
                if (filtered) {
                    return filtered;
                }
            }
        }
        return null;
    }
    
    #removeRTTreeAsId(tree:RTMetadataTree, rtId:string):RTMetadataTree {
        const newTree = tree.filter((item)=>(item.type === 'directory' || item.id !== rtId));
        
        if (newTree.length === tree.length) {
            for (const index in newTree) {
                if (newTree[index].type === 'directory') {
                    const filtered = newTree[index].children.filter((item)=>(item.id !== rtId));
                    newTree[index] = {
                        ...newTree[index],
                        children: filtered,
                    };
                }
            }
        }
        return newTree;
    }

    #getRTIndexAccessor(rtId:string):IJSONAccessor {
        return this.#storage.getJSONAccessor(`request-template:${rtId}:index.json`);
    }

    getRTMode(rtId:string):RTMode {
        const indexAccessor = this.#getRTIndexAccessor(rtId);
        return indexAccessor.get('mode') ?? 'simple';
    }
    setRTMode(rtId:string, mode:RTMode) {
        const indexAccessor = this.#getRTIndexAccessor(rtId);
        switch(mode) {
            case 'simple':
            case 'flow':
                indexAccessor.set('mode', mode);
            default:
                throw new ProfileError('Invalid RT mode');
        }
    }
    
    /* RT 단순 모드에서 활용 */
    setRTPromptText(rtId:string, text:string) {
        const textAccessor = this.#storage.getTextAccessor(`request-template:${rtId}:prompt.txt`);
        textAccessor.write(text);
    }
    getRTPromptText(rtId:string):string {
        const textAccessor = this.#storage.getTextAccessor(`request-template:${rtId}:prompt.txt`);
        return textAccessor.read();
    }
    
    /* RAW 접근 */
    getRTData(rtId:string, key:string):any {
        const indexAccessor = this.#getRTIndexAccessor(rtId);
        return indexAccessor.get(key);
    }
    setRTData(rtId:string, key:string, value:any) {
        const indexAccessor = this.#getRTIndexAccessor(rtId);
        indexAccessor.set(key, value);
    }
}

function rtIdAlreadyExistsError(rtId:string) {
    throw new ProfileError(`rt id already exists : ${rtId}`);
}
function invalidRTIdError(rtId:string) {
    throw new ProfileError(`Invalid rt id : ${rtId}`);
}

export default RequestTemplateControl;