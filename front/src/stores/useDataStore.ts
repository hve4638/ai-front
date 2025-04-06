import { create } from 'zustand'
import { RefetchMethods, UpdateMethods } from './types';
import { profileStoreTool } from './utils';
import { APIKeyMetadata } from '@/types/apikey-metadata';
import useProfileAPIStore from './useProfileAPIStore';

interface DataFields {
    sessions : string[];
    starred_models : string[];
    api_keys_metadata : Record<string, APIKeyMetadata[]>;
}

const defaultData:DataFields = {
    sessions : [],
    starred_models : [],
    api_keys_metadata : {},
}

interface DataState extends DataFields {
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

        update,
        refetch,
        refetchAll,
    }
});

export default useDataStore;