import { IJSONAccessor, type FSStorage } from '@hve/fs-storage';
import { ProfileError } from './errors';

class RequestTemplateControl {
    #storage:FSStorage;
    #tree:RTMetadataTree;
    #rtIds:string[];
    #loaded:boolean = false;

    constructor(storage:FSStorage) {
        this.#storage = storage;
        this.#tree = [];
        this.#rtIds = [];
    }

    #loadTree() {
        if (this.#loaded) return;
        const prompts = this.#storage.getJSONAccessor('request-template:index.json');
        this.#tree = prompts.get('tree') ?? [];
        this.#rtIds = prompts.get('ids') ?? [];

        this.#loaded = true;
    }

    #updateTree() {
        const prompts = this.#storage.getJSONAccessor('request-template:index.json');
        prompts.set('tree', this.#tree);
        
        this.#loaded = true;
    }

    #getRTIds(tree:RTMetadataTree) {
        let promptIds:string[] = [];
        for(const item of tree) {
            if (item.type === 'directory') {
                item.children.forEach((child)=>{
                    promptIds.push(child.prompt_id);
                });
            }
            else {
                promptIds.push(item.prompt_id);
            }
        }

        return promptIds;
    }
    
    getTree():RTMetadataTree {
        this.#loadTree();
        
        return this.#tree;
    }
    
    updateTree(newTree:RTMetadataTree) {
        this.#tree = newTree;
        const prevIds = this.#getRTIds(this.#tree);
        const newIds = this.#getRTIds(newTree);

        for (const id of newIds) {
            if (!prevIds.includes(id)) {
                throw new ProfileError('Invalid rt id');
            }
        }
        this.#tree = newTree;
        this.#updateTree();
    }
    
    addRT(metadata:RTMetadata) {
        const prevIds = this.#getRTIds(this.#tree);
        const hasId = prevIds.some((id)=>(id === metadata.prompt_id));
        if (hasId) {
            throw new ProfileError('rt id already exists');
        }

        this.#tree.push(metadata);
        this.#updateTree();
    }

    removeRT(promptId:string) {
        const newTree = this.#tryRemoveRTTreeAsId(this.#tree, promptId);

        if (!newTree) {
            throw new ProfileError('Invalid rt id');
        }
        this.#tree = newTree;
        this.#updateTree();
    }
    
    #tryRemoveRTTreeAsId(tree:RTMetadataTree, promptId:string):RTMetadataTree|null {
        const newTree = tree.filter((item)=>(item.type === 'directory' || item.prompt_id !== promptId));
        
        if (newTree.length !== tree.length) {
            return newTree;
        }
        for (const index in newTree) {
            if (newTree[index].type === 'directory') {
                const filtered = this.#tryRemoveRTTreeAsId(newTree[index].children, promptId);

                if (filtered) {
                    newTree[index] = {
                        ...newTree[index],
                        children: filtered as RTMetadata[],
                    };
                    return newTree;
                }
            }
        }
        return null;
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

export default RequestTemplateControl;