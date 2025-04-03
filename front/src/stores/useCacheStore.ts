import { create } from 'zustand'

import { LayoutModes, ThemeModes } from 'types/profile';
import { useProfileAPIStore } from './useProfileAPIStore';
import { UpdateMethods } from './types';
import { makeSetter } from './utils';

interface CacheFields {
    last_session_id : number|null,
    prompt_variables : unknown,
    setting_models_show_featured : boolean,
    setting_models_show_snapshot : boolean,
    setting_models_show_experimental : boolean,
    setting_models_show_deprecated : boolean,
}

const defaultCache:CacheFields = {
    last_session_id : null,
    prompt_variables : {},
    setting_models_show_featured : true,
    setting_models_show_snapshot : true,
    setting_models_show_experimental : false,
    setting_models_show_deprecated : false,
}

interface ProfileState extends CacheFields {
    update : UpdateMethods<CacheFields>;
}

const setter = makeSetter<CacheFields>('cache.json');

export const useProfileCacheStore = create<ProfileState>((set)=>({
    ...defaultCache,
    update : {
        last_session_id : setter<number|null>(set, 'last_session_id'),
        prompt_variables : setter<unknown>(set, 'prompt_variables'),
        setting_models_show_featured : setter<boolean>(set, 'setting_models_show_featured'),
        setting_models_show_snapshot : setter<boolean>(set, 'setting_models_show_snapshot'),
        setting_models_show_experimental : setter<boolean>(set, 'setting_models_show_experimental'),
        setting_models_show_deprecated : setter<boolean>(set, 'setting_models_show_deprecated'),
    }
}))
