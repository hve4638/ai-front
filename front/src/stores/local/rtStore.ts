import { create } from 'zustand'
import useProfileAPIStore from '@/stores/useProfileAPIStore';
import { PromptData } from '@/types';

export interface RTState {
    id: string|null;
    get : {
        mode(): Promise<string>;
        metadata(): Promise<Record<string, any>>;
        promptdata(promptId:string): Promise<PromptData>;
    };
    update : {
        id(id:string): Promise<void>;
        mode(mode:string): Promise<void>;
        metadata(data:Record<string, any>): Promise<void>;
        promptdata(promptId:string, data:PromptData): Promise<void>;
    };
}

function getRTAPI(rtId:string|null) {
    if (rtId == null) return null;

    const { api } = useProfileAPIStore.getState();
    return api.getRT(rtId);
}

export function createRTStore(rtId:string) {
    return  create<RTState>((set, get)=>({
        id : rtId,
        get: {
            mode: async () => {
                const rtAPI = getRTAPI(get().id);
                if (!rtAPI) return '';
    
                return await rtAPI.getOne('index.json', 'mode') ?? '';
            },
            metadata: async () => {
                const rtAPI = getRTAPI(get().id);
                if (!rtAPI) return {};
    
                return await rtAPI.get('index.json', ['name', 'metadata']) ?? {};
            },
            promptdata: async (promptId:string) => {
                const rtId = get().id;
                const rtAPI = getRTAPI(rtId);
                if (!rtAPI) throw new Error('rtId is not provided');
    
                const metadata = await rtAPI.get('index.json', ['name', 'mode'])
                const result = await rtAPI.getPromptData(
                    promptId,
                    ['contents', 'input_type', 'forms']
                );
    
                return {
                    name: metadata['name'],
                    id: rtId ?? '',
                    forms: result['forms'] ?? [],
                    inputType: result['input_type'] ?? 'NORMAL',
                    contents: result['contents'] ?? '',
                }
            }
        },
        update: {
            id: async (id:string)=>{
                set({id});
            },
            mode: async (mode:string) => {
                const rtAPI = getRTAPI(get().id);
                if (!rtAPI) return;
                
                await rtAPI.setOne('index.json', 'mode', mode);
            },
            metadata: async (metadata:KeyValueInput) => {
                const rtAPI = getRTAPI(get().id);
                if (!rtAPI) return;
    
                await rtAPI.set('index.json', metadata);
            },
            promptdata: async (promptId:string, data:PromptData) => {
                const rtAPI = getRTAPI(get().id);
                if (!rtAPI) return;
                
                await rtAPI.set('index.json', { name : data.name });
                await rtAPI.setPromptData(
                    promptId,
                    {
                        id : data.id,
                        forms : data.forms,
                        input_type : data.inputType,
                        contents : data.contents,
                    }
                );
                await rtAPI.reflectMetadata();
            }
        }
    }));
}