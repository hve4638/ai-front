import { create } from 'zustand'
import { RefetchMethods, UpdateMethods } from './types';
import { profileStoreTool, sessionStoreTool } from './utils';
import ProfilesAPI, { type ProfileAPI } from '@/api/profiles';
import RequestManager from '@/features/request-manager';

interface SessionCacheFields {
    input:string;
    output:string;
    token_count:number;
    warning_message:string|null;
    state:'loading'|'idle'|'error'|'done';
}

interface SessionConfigFields {
    name:string|null;
    model_id:string;
    rt_id:string;
    color:string;
}

const defaultCache:SessionCacheFields = {
    input : '',
    output : '',
    token_count : 0,
    warning_message : null,
    state: 'idle',
}
const defaultConfig:SessionConfigFields = {
    name : null,
    model_id : '',
    rt_id : '',
    color: 'default',
}

type SessionFields = SessionCacheFields & SessionConfigFields;

interface SessionState extends SessionFields {
    actions : {
        request():Promise<void>;
        abortRequest():Promise<void>;
    };
    deps : {
        api : ProfileAPI;
        last_session_id : string|null;
    };
    updateDeps : {
        api(data:ProfileAPI) : void;
        last_session_id(id:string|null) : void;
    };
    update : UpdateMethods<SessionFields>;
    refetch : RefetchMethods<SessionFields>;
    refetchAll : () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get)=>{
    const {
        update : updateCache,
        refetch : refetchCache,
        refetchAll : refetchAllCache
    } = sessionStoreTool<SessionCacheFields>(set, get, 'cache.json', defaultCache);
    const {
        update : updateConfig,
        refetch : refetchConfig,
        refetchAll : refetchAllConfig
    } = sessionStoreTool<SessionConfigFields>(set, get, 'config.json', defaultConfig);

    return {
        ...defaultCache,
        ...defaultConfig,

        actions : {
            request : async () => {
                const {
                    last_session_id,
                    api,
                } = get().deps;
                if (api.isMock()) {
                    console.warn('API is not initialized. Request is ignored.');
                    return;
                }
                if (!last_session_id) return;

                RequestManager.request(api.id, last_session_id);
            },
            abortRequest : async () => {
                
            }
        },
        deps : {
            last_session_id : null,
            api : ProfilesAPI.getMockProfile(),
        },
        updateDeps : {
            last_session_id : (id:string|null) => set({ deps : { ...get().deps, last_session_id : id } }),
            api : (api:ProfileAPI) => set({ deps : { ...get().deps, api } }),
        },
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
                refetchAllConfig(),
            ]);
        }
    };
});

export default useSessionStore;