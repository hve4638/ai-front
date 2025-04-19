import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { RefetchMethods, UpdateMethods } from './types';
import { profileStoreTool } from './utils';

interface CacheFields {
    last_session_id : string|null,
    prompt_variables : unknown,
    setting_models_show_featured : boolean,
    setting_models_show_snapshot : boolean,
    setting_models_show_experimental : boolean,
    setting_models_show_deprecated : boolean,

    history_search_scope : 'any'|'input'|'output',
}

const defaultCache:CacheFields = {
    last_session_id : null,
    prompt_variables : {},
    setting_models_show_featured : true,
    setting_models_show_snapshot : true,
    setting_models_show_experimental : false,
    setting_models_show_deprecated : false,

    history_search_scope : 'any',
}

interface ProfileState extends CacheFields {
    update : UpdateMethods<CacheFields>;
    refetch : RefetchMethods<CacheFields>;
    refetchAll : () => Promise<void>;
}

const ACCESSOR_ID = 'cache.json';

const useCacheStore = create<ProfileState, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set, get)=>{
        const {
            update,
            refetch,
            refetchAll
        } = profileStoreTool<CacheFields>(set, get, ACCESSOR_ID, defaultCache);
    
        return {
            ...defaultCache,
            update,
            refetch,
            refetchAll
        }
    })
);


export default useCacheStore;