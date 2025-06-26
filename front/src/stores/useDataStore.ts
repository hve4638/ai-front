import { create } from 'zustand'
import { RefetchMethods, UpdateMethods } from './types';
import { profileStoreTool } from './utils';
import { APIKeyMetadata } from '@/types/apikey-metadata';
import ProfilesAPI, { ProfileAPI } from '@/api/profiles';

interface DataFields {
    custom_models : CustomModel[];
    sessions : string[];
    starred_models : string[];
    api_keys : Record<string, APIKeyMetadata[]>;
}

const defaultData:DataFields = {
    custom_models : [],
    sessions : [],
    starred_models : [],
    api_keys : {},
}

interface DataState extends DataFields {
    deps : {
        api : ProfileAPI;
    };
    updateDeps : {
        api(data:ProfileAPI) : void;
    };
    update : UpdateMethods<DataFields>;
    refetch : RefetchMethods<DataFields>;
    refetchAll : () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get)=>{
    const {
        update,
        refetch,
        refetchAll
    } = profileStoreTool<DataFields>(set, get, 'data.json', defaultData);
    
    return {
        ...defaultData,

        deps : {
            api : ProfilesAPI.getMockProfile(),
        },
        updateDeps : {
            api : (api:ProfileAPI) => set({ deps : { api } }),
        },
        update,
        refetch,
        refetchAll,
    }
});

export default useDataStore;