import { type IJSONAccessor, type ITextAccessor, type IStorage } from '@hve/fs-storage';
import { ProfileError } from './errors';

class RequestTemplateControl {
    #storage:IStorage;
    #tree:RTMetadataTree;
    #rtIds:string[];
    #lastNewRTIdIndex:number = 0;
    #loaded:boolean = false;

    constructor(storage:IStorage) {
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

    #getRTIndexAccessor(rtId:string):IJSONAccessor {
        return this.#storage.getJSONAccessor(`request-template:${rtId}:index.json`);
    }

    #getRTPromptAccessor(rtId:string, promptId:string):IJSONAccessor {
        return this.#storage.getJSONAccessor(`request-template:${rtId}:prompts:${promptId}.json`);
    }

    #getRTTextAccessor(rtId:string, target:string):ITextAccessor {
        return this.#storage.getTextAccessor(`request-template:${rtId}:${target}`);
    }

    #loadData() {
        if (this.#loaded) return;
        const prompts = this.#getEntrypointAccessor();
        this.#tree = prompts.get('tree') ?? [];
        this.#rtIds = prompts.get('ids') ?? [];
        
        this.#loaded = true;
    }

    #storeData() {
        const prompts = this.#getEntrypointAccessor();
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

        indexAccessor.set('name', metadata.name);
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

    setRTPromptData(data:RTPromptData) {
        this.#loadData();
        const rtId = data.id;
        const indexAccessor = this.#getRTIndexAccessor(rtId);
        if (data.name) this.#updateRTNameInTree(rtId, data.name);
        if (data.name) indexAccessor.set('name', data.name);
        if (data.forms) indexAccessor.set('forms', data.forms);
        if (data.inputType) indexAccessor.set('input_type', data.inputType);
        if (data.contents) {
            const textAccessor = this.#getRTTextAccessor(rtId, 'prompt.txt');
            textAccessor.write(data.contents);
        }
    }

    getRTPromptData(rtId:string, promptId:string):RTPromptData {
        const indexAccessor = this.#getRTIndexAccessor(rtId);
        const mode = indexAccessor.get('mode');
        if (mode !== 'simple') {
            throw new ProfileError('this method is only available in simple mode');
        }
        
        const name:string = indexAccessor.get('name');
        const inputType = indexAccessor.get('input_type');
        const forms:PromptVar[] = indexAccessor.get('forms');

        const textAccessor = this.#getRTTextAccessor(rtId, 'prompt.txt');
        const contents = textAccessor.read();

        return {
            inputType : inputType ?? 'text',
            forms : forms ?? [],
            name : name ?? 'New Prompt',
            id : rtId,
            contents : contents ?? '',
        };
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