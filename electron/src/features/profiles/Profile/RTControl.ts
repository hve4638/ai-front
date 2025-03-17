import { type IJSONAccessor, type ITextAccessor, type IACStorage, IACSubStorage } from 'ac-storage';
import { ProfileError } from './errors';

class RTControl {
    #storage:IACSubStorage;
    #tree:RTMetadataTree;
    #rtIds:string[];
    #lastNewRTIdIndex:number = 0;
    #loaded:boolean = false;

    constructor(storage:IACSubStorage) {
        this.#storage = storage;
        this.#tree = [];
        this.#rtIds = [];
    }

    /** request-template의 entrypoint 접근자 */
    #accessEntrypoint() {
        return this.#storage.accessAsJSON('index.json');
    }

    #accessPromptData(rtId:string, promptId:string):IJSONAccessor {
        return this.#storage.accessAsJSON(`${rtId}:prompts:${promptId}.json`);
    }

    #accessRTIndex(rtId:string):IJSONAccessor {
        return this.#storage.accessAsJSON(`${rtId}:index.json`);
    }

    #loadData() {
        if (this.#loaded) return;
        const prompts = this.#accessEntrypoint();
        this.#tree = prompts.getOne('tree') ?? [];
        this.#rtIds = prompts.getOne('ids') ?? [];
        
        this.#loaded = true;
    }

    #storeData() {
        const prompts = this.#accessEntrypoint();
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
    
    /**
     * RT 트리 갱신
     * 
     * 새로운 RT 트리는 기존 트리에 존재하는 모든 RT를 포함해야 한다.
     * 
     * 새 RT 추가 후 위치 지정은, addRT()를 통한 RT 추가후 updateTree()를 호출해야 한다.
     * 
     * 새 디렉토리는 updateTree를 통해 바로 추가 및 제거할 수 있으며 빈 디렉토리도 허용된다.
     */
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
    
    /**
     * 새 RT 추가 및 RTTree 반영
     * @param metadata 
     */
    addRT(metadata:RTMetadata) {
        this.#loadData();

        if (this.#hasId(metadata.id)) {
            throw rtIdAlreadyExistsError(metadata.id);
        }

        const indexAccessor = this.#accessRTIndex(metadata.id);

        indexAccessor.setOne('name', metadata.name);
        this.#rtIds.push(metadata.id);
        this.#tree.push({
            type : 'node',
            id : metadata.id,
            name : metadata.name
        });
        this.#storeData();
    }
    
    /**
     * RT 제거 및 RTTree 반영
     * @param metadata 
     */
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

    /**
     * RT ID 변경
     * @param oldRTId 
     * @param newRTId 
     */
    changeId(oldRTId:string, newRTId:string) {
        this.#loadData();
        
        if (!this.#hasId(oldRTId)) throw invalidRTIdError(oldRTId);
        if (this.#hasId(newRTId)) throw rtIdAlreadyExistsError(newRTId);

        this.#storage.move(`${oldRTId}`, `${newRTId}`);

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

    /**
     * 사용되지 않는 RT ID 생성
     */
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

    #findRTMetadata(tree:RTMetadataTree, rtId:string):RTMetadataNode|null {
        const item = tree.find((item)=>(item.type !== 'directory' && item.id === rtId));
        if (item) {
            return item as RTMetadataNode;
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
        const indexAccessor = this.#accessRTIndex(rtId);
        return indexAccessor.getOne('mode') ?? 'prompt_only';
    }
    setRTMode(rtId:string, mode:RTMode) {
        const indexAccessor = this.#accessRTIndex(rtId);
        switch(mode) {
            case 'prompt_only':
            case 'flow':
                indexAccessor.setOne('mode', mode);
            default:
                throw new ProfileError('Invalid RT mode');
        }
    }

    /**
     * RT 프롬프트 데이터 설정
     * 
     * @param rtId 
     * @param promptId 
     * @param data 
     */
    setRTPromptData(rtId:string, promptId:string, data:KeyValueInput) {
        this.#loadData();
        const promptDataAccessor = this.#accessPromptData(rtId, promptId);
        promptDataAccessor.set(data);

        // 이름 변경 시 <rt>/index.json도 업데이트
        // if (keys.includes('name')) {
        //     const { name, mode } = promptDataAccessor.get(['name', 'mode']);
        //     if (mode === 'prompt_only') {
        //         this.#accessRTIndex(rtId).setOne('name', name);
        //         this.#updateRTNameInTree(rtId, name);
        //     }
        // }
        // if (keys.includes('id')) {
        //     const newId = promptDataAccessor.getOne('id');
        //     if (newId && newId !== promptId) {
        //         const newPromptDataAccessor = this.#accessPromptData(rtId, newId);
                
        //         newPromptDataAccessor.set(promptDataAccessor.getAll());

        //         promptDataAccessor.drop();
        //         newPromptDataAccessor.commit();
        //     }
        // }
    }

    getRTPromptData(rtId:string, promptId:string, keys:string[]) {
        this.#loadData();
        const indexAccessor = this.#accessPromptData(rtId, promptId);
        
        return indexAccessor.get(...keys);
    }
    
    /* RAW 접근 */
    getRTData(rtId:string, accessId:string, keys:string[]):any {
        const accessor = this.#storage.accessAsJSON(`${rtId}:${accessId}`);
        return accessor.get(...keys);
    }
    setRTData(rtId:string, accessId:string, data:KeyValueInput) {
        const accessor = this.#storage.accessAsJSON(`${rtId}:${accessId}`);
        return accessor.set(data);
    }

    updateRTMetadata(rtId:string) {
        const name = this.#accessRTIndex(rtId).getOne('name');
        this.#updateRTNameInTree(rtId, name);
    }
}

function rtIdAlreadyExistsError(rtId:string) {
    throw new ProfileError(`rt id already exists : ${rtId}`);
}
function invalidRTIdError(rtId:string) {
    throw new ProfileError(`Invalid rt id : ${rtId}`);
}

export default RTControl;