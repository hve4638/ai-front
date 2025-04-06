import { create } from 'zustand'
import { RefetchMethods, UpdateMethods } from './types';
import { profileStoreTool } from './utils';

interface SessionCacheFields {
    input:string;
    output:string;
    token_count:number;
    warning_message:string|null;
}

interface SessionConfigFields {
    name:string|null;
    model_id:string;
    rt_id:string;
}

const defaultCache:SessionCacheFields = {
    input : '',
    output : '',
    token_count : 0,
    warning_message : null,
}
const defaultConfig:SessionConfigFields = {
    name : null,
    model_id : '',
    rt_id : '',
}

type SessionFields = SessionCacheFields & SessionConfigFields;

interface ProfileState extends SessionFields {
    update : UpdateMethods<SessionFields>;
    refetch : RefetchMethods<SessionFields>;
    refetchAll : () => Promise<void>;
}


export const useSessionStore = create<ProfileState>((set, get)=>{
    const {
        update : updateCache,
        refetch : refetchCache,
        refetchAll : refetchAllCache
    } = profileStoreTool<SessionCacheFields>(set, get, 'cache.json', defaultCache);
    const {
        update : updateConfig,
        refetch : refetchConfig,
        refetchAll : refetchAllConfig
    } = profileStoreTool<SessionConfigFields>(set, get, 'config.json', defaultConfig);

    return {
        ...defaultCache,
        ...defaultConfig,
        
        update : {
            ...updateCache,
            ...updateConfig
        },
        refetch : {
            ...refetchCache,
            ...refetchConfig
        },
        refetchAll: async () => {
            await Promise.all([
                refetchAllCache(),
                refetchAllConfig()
            ]);
        }
    };
});

export default useSessionStore;