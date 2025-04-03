import { create } from 'zustand'
import { useProfileAPIStore } from './useProfileAPIStore';
import { UpdateMethods } from './types';
import { makeSetter } from './utils';

interface DataFields {
    sessions : any[],
    starred_models : any[],
    api_keys : Record<string, string>,
}

const defaultData:DataFields = {
    sessions : [],
    starred_models : [],
    api_keys : {},
}

interface DataState extends DataFields {
    update : UpdateMethods<DataFields>;
}

const setter = makeSetter<DataFields>('data.json');

export const useDataStore = create<DataState>((set)=>({
    ...defaultData,
    update : {
        sessions : setter<any[]>(set, 'sessions'),
        starred_models : setter<any[]>(set, 'starred_models'),
        api_keys : setter<Record<string, string>>(set, 'api_keys'),
    },
}));

