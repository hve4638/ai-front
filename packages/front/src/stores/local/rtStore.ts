import { create } from 'zustand'
import useProfileAPIStore from '@/stores/useProfileAPIStore';
import { PromptData } from '@/types';

export interface RTState {
    id: string|null;
    get : {
        metadata(): Promise<RTIndex>;

        promptMetadata(promptId:string): Promise<RTPromptData>;
        promptName(promptId:string): Promise<string>;
        promptVars(promptId:string): Promise<PromptVar[]>;
        promptContents(promptId:string): Promise<string>;
    };
    update : {
        metadata(data:Partial<RTIndex>): Promise<void>;
        promptMetadata(promptId:string, data:RTPromptDataEditable): Promise<void>;

        promptName(promptId:string, name:string): Promise<void>;
        promptVars(promptId:string, vars:PromptVar[]): Promise<string[]>;
        promptContents(promptId:string, text:string): Promise<void>;
    };
    remove : {
        promptVars(promptId:string, varId:string[]): Promise<void>
    }
}

function getRTAPI(rtId:string|null) {
    if (rtId == null) throw new Error('rtId is not provided');

    const { api } = useProfileAPIStore.getState();
    return api.rt(rtId);
}

export function createRTStore(rtId:string) {
    return  create<RTState>((set, get)=>({
        id : rtId,
        get: {
            metadata: async () => {
                const rtAPI = getRTAPI(get().id);
                
                return await rtAPI.getMetadata();
            },

            promptMetadata: async (promptId:string) => {
                const rtAPI = getRTAPI(get().id);
    
                return await rtAPI.prompt.getMetadata(promptId);
            },
            promptName: async (promptId:string) => {
                const rtAPI = getRTAPI(get().id);
    
                return await rtAPI.prompt.getName(promptId);
            },
            promptVars: async (promptId:string) => {
                const rtAPI = getRTAPI(get().id);
    
                return await rtAPI.prompt.getVariables(promptId);
            },
            promptContents: async (promptId:string) => {
                const rtAPI = getRTAPI(get().id);
    
                return await rtAPI.prompt.getContents(promptId);
            },
        },
        update: {
            metadata: async (metadata:Partial<RTIndex>) => {
                const rtAPI = getRTAPI(get().id);
    
                await rtAPI.setMetadata(metadata);
            },
            promptMetadata: async (promptId:string, data:RTPromptDataEditable) => {
                const rtAPI = getRTAPI(get().id);
    
                await rtAPI.prompt.setMetadata(promptId, data);
            },
            promptName: async (promptId:string, name:string) => {
                const rtAPI = getRTAPI(get().id);
    
                await rtAPI.prompt.setName(promptId, name);
            },
            promptVars: async (promptId:string, vars:PromptVar[]) => {
                const rtAPI = getRTAPI(get().id);
    
                return await rtAPI.prompt.setVariables(promptId, vars);
            },
            promptContents: async (promptId:string, text:string) => {
                const rtAPI = getRTAPI(get().id);
    
                await rtAPI.prompt.setContents(promptId, text);
            },
        },
        remove : {
            promptVars: async (promptId:string, varIds:string[]) => {
                const rtAPI = getRTAPI(get().id);
    
                await rtAPI.prompt.removeVariables(promptId, varIds);
            },
        }
    }));
}