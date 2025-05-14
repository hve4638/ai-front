import { IPCError } from 'api/error'
import LocalAPI from '@/api/local'

class RTAPI {
    #profileId: string;
    #rtId: string;

    constructor(profileId:string, rtId:string) {
        this.#profileId = profileId;
        this.#rtId = rtId;
    }

    async getMetadata() { return LocalAPI.profileRT.getMetadata(this.#profileId, this.#rtId); };
    async setMetadata(metadata:KeyValueInput) { return LocalAPI.profileRT.setMetadata(this.#profileId, this.#rtId, metadata); };

    async reflectMetadata() { return LocalAPI.profileRT.reflectMetadata(this.#profileId, this.#rtId); }

    async getForms() { return await LocalAPI.profileRT.getForms(this.#profileId, this.#rtId); }

    node = {
        add : async (nodeCategory: string) => LocalAPI.profileRT.addNode(this.#profileId, this.#rtId, nodeCategory),
        remove : async (nodeId: number) => LocalAPI.profileRT.removeNode(this.#profileId, this.#rtId, nodeId),
        updateOption : async (nodeId: number, option:Record<string, unknown>) => LocalAPI.profileRT.updateNodeOption(this.#profileId, this.#rtId, nodeId, option),
        connect : async (from:RTNodeEdge, to:RTNodeEdge) => LocalAPI.profileRT.connectNode(this.#profileId, this.#rtId, from, to),
        disconnect : async (form:RTNodeEdge, to:RTNodeEdge) => LocalAPI.profileRT.disconnectNode(this.#profileId, this.#rtId, form, to),
    };
    
    prompt = {
        getMetadata : async (promptId:string) => LocalAPI.profileRTPrompt.getMetadata(this.#profileId, this.#rtId, promptId),
        getName : async (promptId:string) => LocalAPI.profileRTPrompt.getName(this.#profileId, this.#rtId, promptId),
        setName : async (promptId:string, name:string) => LocalAPI.profileRTPrompt.setName(this.#profileId, this.#rtId, promptId, name),
        
        getVariableNames : async (promptId:string) => LocalAPI.profileRTPrompt.getVariableNames(this.#profileId, this.#rtId, promptId),
        getVariables : async (promptId:string) => LocalAPI.profileRTPrompt.getVariables(this.#profileId, this.#rtId, promptId),
        setVariables : async (promptId:string, forms:PromptVar[]) => LocalAPI.profileRTPrompt.setVariables(this.#profileId, this.#rtId, promptId, forms),
        removeVariables : async (promptId:string, formIds:string[]) => LocalAPI.profileRTPrompt.removeVariables(this.#profileId, this.#rtId, promptId, formIds),
        getContents : async (promptId:string):Promise<string> => LocalAPI.profileRTPrompt.getContents(this.#profileId, this.#rtId, promptId),
        setContents : async (promptId:string, contents:string) => LocalAPI.profileRTPrompt.setContents(this.#profileId, this.#rtId, promptId, contents),
    } as const;
}

export default RTAPI;