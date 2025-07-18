import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { RefetchMethods, UpdateMethods } from './types';
import { globalStoreTool, profileStoreTool } from './utils';

interface GlobalConfigFields {
    shared_mode: boolean;
}

const defaultCache:GlobalConfigFields = {
    shared_mode : false,
}

interface GlobalConfigState extends GlobalConfigFields {
    update : UpdateMethods<GlobalConfigFields>;
    refetch : RefetchMethods<GlobalConfigFields>;
    refetchAll : () => Promise<void>;
}

const useGlobalConfigStore = create<GlobalConfigState, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set, get)=>{
        const {
            update,
            refetch,
            refetchAll
        } = globalStoreTool<GlobalConfigFields>(set, get, 'config.json', defaultCache);
    
        return {
            ...defaultCache,
            update,
            refetch,
            refetchAll
        }
    })
);


export default useGlobalConfigStore;