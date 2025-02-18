import { type IJSONAccessor, type ITextAccessor, type IACStorage } from 'ac-storage';
import { ProfileError } from './errors';

class RTControl {
    #storage:IACStorage;
    #tree:RTMetadataTree;
    #rtIds:string[];
    #lastNewRTIdIndex:number = 0;
    #loaded:boolean = false;

    constructor(storage:IACStorage) {
        this.#storage = storage;
        this.#tree = [];
        this.#rtIds = [];
    }

    /** request-template의 entrypoint 접근자 */
    #getEntrypointAccessor() {
        return this.#storage.getJSONAccessor('request-template:index.json');
    }
    
    #getCacheAccessor() {
        return this.#storage.getJSONAccessor('request-template:cache.json');
    }

    #getRTPromptDataAccessor(rtId:string, promptId:string):IJSONAccessor {
        return this.#storage.getJSONAccessor(`request-template:${rtId}:prompts:${promptId}.json`);
    }

    #getRTIndexAccessor(rtId:string):IJSONAccessor {
        return this.#storage.getJSONAccessor(`request-template:${rtId}:index.json`);
    }

    #loadData() {
        if (this.#loaded) return;
        const prompts = this.#getEntrypointAccessor();
        this.#tree = prompts.getOne('tree') ?? [];
        this.#rtIds = prompts.getOne('ids') ?? [];
        
        this.#loaded = true;
    }

    #storeData() {
        const prompts = this.#getEntrypointAccessor();
        prompts.set({
            'tree' :  this.#tree,
            'ids' : this.#rtIds,
        });
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

    #updateRTNameInTree(rtId:string, newName:string) {
        try {
            for (const item of this.#tree) {
                if (item.type === 'directory') {
                    for (const child of item.children) {
                        if (child.id === rtId) {
                            child.name = newName;
                            return;
                        }
                    }
                }
                else if (item.id === rtId) {
                    item.name = newName;
                    return;
                }
            }
        }
        finally {
            this.#storeData();
        }
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

        const indexAccessor = this.#getRTIndexAccessor(metadata.id);

        indexAccessor.setOne('name', metadata.name);
        this.#rtIds.push(metadata.id);
        this.#tree.push({
            type : 'node',
            id : metadata.id,
            name : metadata.name
        });
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

        throw new Error('Not implemented');
        // rt 디렉토리 자체를 이동하도록 구현 필요
        
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

    getRTMode(rtId:string):RTMode {
        const indexAccessor = this.#getRTIndexAccessor(rtId);
        return indexAccessor.getOne('mode') ?? 'simple';
    }
    setRTMode(rtId:string, mode:RTMode) {
        const indexAccessor = this.#getRTIndexAccessor(rtId);
        switch(mode) {
            case 'simple':
            case 'flow':
                indexAccessor.setOne('mode', mode);
            default:
                throw new ProfileError('Invalid RT mode');
        }
    }

    setRTPromptData(rtId:string, promptId:string, data:KeyValueInput) {
        this.#loadData();
        const promptDataAccessor = this.#getRTPromptDataAccessor(rtId, promptId);

        const names = promptDataAccessor.set(data);
        if (names.includes('name')) {
            this.#updateRTNameInTree(rtId, promptDataAccessor.getOne('name'));
        }
        if (names.includes('id')) {
            const newId = promptDataAccessor.getOne('id');
            if (newId && newId !== promptId) {
                const newPromptDataAccessor = this.#getRTPromptDataAccessor(rtId, newId);
                
                newPromptDataAccessor.set(promptDataAccessor.getAll());

                promptDataAccessor.drop();
                newPromptDataAccessor.commit();
            }
        }
    }

    getRTPromptData(rtId:string, promptId:string, keys:string[]) {
        const indexAccessor = this.#getRTPromptDataAccessor(rtId, promptId);
        
        return indexAccessor.get(keys);
    }
    
    /* RAW 접근 */
    getRTData(rtId:string, keys:string[]):any {
        const indexAccessor = this.#getRTIndexAccessor(rtId);
        return indexAccessor.get(keys);
    }
    setRTData(rtId:string, data:KeyValueInput) {
        const indexAccessor = this.#getRTIndexAccessor(rtId);
        indexAccessor.set(data);
    }
}

function rtIdAlreadyExistsError(rtId:string) {
    throw new ProfileError(`rt id already exists : ${rtId}`);
}
function invalidRTIdError(rtId:string) {
    throw new ProfileError(`Invalid rt id : ${rtId}`);
}

export default RTControl;