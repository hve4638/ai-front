import { type IJSONAccessor, type ITextAccessor, type IACStorage, IACSubStorage } from 'ac-storage';
import { ProfileError } from '../errors';
import IRTControl from './IRTControl';
import ProfileRT from './ProfileRT';
import RTTemplateBuilder from './RTTemplateBuilder';

class ProfileRTs implements IRTControl {
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

    async #accessPromptData(rtId:string, promptId:string):Promise<IJSONAccessor> {
        return await this.#storage.accessAsJSON(`${rtId}:prompts:${promptId}.json`);
    }

    async #accessRTIndex(rtId:string):Promise<IJSONAccessor> {
        return await this.#storage.accessAsJSON(`${rtId}:index.json`);
    }

    async #loadData() {
        if (this.#loaded) return;
        const prompts = await this.#accessEntrypoint();
        this.#tree = prompts.getOne('tree') ?? [];
        this.#rtIds = prompts.getOne('ids') ?? [];
        
        this.#loaded = true;
    }

    async #storeData() {
        const prompts = await this.#accessEntrypoint();
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


    /**
     * 각 RT의 이름을 트리 목록에 갱신
     */
    async #updateRTNameInTree(rtId:string, newName:string) {
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
            await this.#storeData();
        }
    }
    
    async getTree():Promise<RTMetadataTree> {
        await this.#loadData();
        
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
    async updateTree(newTree:RTMetadataTree) {
        await this.#loadData();
        
        this.#tree = newTree;
        const prevIds = this.#getRTIds(this.#tree);
        const newIds = this.#getRTIds(newTree);

        for (const id of newIds) {
            if (!prevIds.includes(id)) {
                throw invalidRTIdError(id);
            }
        }
        this.#tree = newTree;
        await this.#storeData();
    }
    
    /**
     * 새 RT 추가 및 RTTree 반영
     * @param metadata 
     */
    async addRT(metadata:RTMetadata, template?:RTTemplate) {
        await this.#loadData();

        if (this.#hasId(metadata.id)) {
            throw rtIdAlreadyExistsError(metadata.id);
        }

        const rt = this.rt(metadata.id);
        await rt.setMetadata({
            id : metadata.id,
            name : metadata.name,
            mode : metadata.mode,
            input_type : 'normal',
        });

        this.#rtIds.push(metadata.id);
        this.#tree.push({
            type : 'node',
            id : metadata.id,
            name : metadata.name
        });
        await this.#storeData();

        if (metadata.mode === 'prompt_only') {
            template = 'basic';
        }

        const templateBuilder = new RTTemplateBuilder(rt)
        switch(template) {
            case 'basic':
                console.log('adjust basic template');
                await templateBuilder.basic();
                break;
            case 'chat':
                break;
        }
    }
    
    /**
     * RT 제거 및 RTTree 반영
     * @param metadata 
     */
    async removeRT(rtId:string) {
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
    async changeId(oldRTId:string, newRTId:string) {
        await this.#loadData();
        
        if (!this.#hasId(oldRTId)) throw invalidRTIdError(oldRTId);
        if (this.#hasId(newRTId)) throw rtIdAlreadyExistsError(newRTId);

        await this.#storage.move(`${oldRTId}`, `${newRTId}`);

        const metadata = this.#findRTMetadata(this.#tree, oldRTId);
        if (metadata) {
            metadata.id = newRTId;
            
            const newIds = this.#rtIds.filter((id)=>(id !== oldRTId));
            newIds.push(newRTId);
            this.#rtIds = newIds;
        }

        await this.#storeData();
    }

    async hasId(rtId:string):Promise<boolean> {
        await this.#loadData();
        return this.#hasId(rtId);
    }

    /**
     * 사용되지 않는 RT ID 생성
     */
    async generateId():Promise<string> {
        await this.#loadData();
        
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

    async getRTMode(rtId:string):Promise<RTMode> {
        const indexAccessor = await this.#accessRTIndex(rtId);
        return indexAccessor.getOne('mode') ?? 'prompt_only';
    }
    async setRTMode(rtId:string, mode:RTMode) {
        const indexAccessor = await this.#accessRTIndex(rtId);
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
    async setRTPromptData(rtId:string, promptId:string, data:KeyValueInput) {
        this.#loadData();
        const promptDataAccessor = await this.#accessPromptData(rtId, promptId);
        promptDataAccessor.set(data);
    }

    async getRTPromptData(rtId:string, promptId:string, keys:string[]) {
        this.#loadData();
        const indexAccessor = await this.#accessPromptData(rtId, promptId);
        
        return indexAccessor.get(...keys);
    }
    
    /* RAW 접근 */
    async getRTData(rtId:string, accessId:string, keys:string[]):Promise<any> {
        const accessor = await this.#storage.accessAsJSON(`${rtId}:${accessId}`);
        return accessor.get(...keys);
    }
    async setRTData(rtId:string, accessId:string, data:KeyValueInput) {
        const accessor = await this.#storage.accessAsJSON(`${rtId}:${accessId}`);
        return accessor.set(data);
    }

    /**
     * RT 상태를 메타데이터에 반영
     * 
     * RT의 이름을 메타데이터 트리에 갱신
     * 
     * @param rtId 
     */
    async updateRTMetadata(rtId:string) {
        const ac = await this.#accessRTIndex(rtId);
        const name = ac.getOne('name');

        this.#updateRTNameInTree(rtId, name);
    }

    rt(rtId:string):ProfileRT {
        return new ProfileRT(this.#storage, rtId);
    }
}

function rtIdAlreadyExistsError(rtId:string) {
    throw new ProfileError(`rt id already exists : ${rtId}`);
}
function invalidRTIdError(rtId:string) {
    throw new ProfileError(`Invalid rt id : ${rtId}`);
}

export default ProfileRTs;