import { create } from 'zustand'
import { Shortcut } from '@/types/shortcut';
import { LayoutModes, ThemeModes } from '@/types/profile';
import { RefetchMethods, UpdateMethods } from './types';
import { profileStoreTool } from './utils';

interface ConfigFields {
    font_size: number;
    theme_mode: ThemeModes;
    layout_mode: LayoutModes;
    history_enabled: boolean;

    textarea_padding : number;
    textarea_io_ratio : [number, number];
    
    remember_deleted_session_count: number;
    confirm_on_session_close: boolean;
    max_history_limit_per_session: number;
    max_history_storage_days: number;
    global_shortcut_enabled: boolean;
    only_starred_models: boolean;
    show_actual_model_name: boolean;
    clear_on_submit_normal: boolean;
    clear_on_submit_chat: boolean;
}

const defaultConfig:ConfigFields = {
    font_size: 18,
    theme_mode: ThemeModes.SYSTEM_DEFAULT,
    layout_mode: LayoutModes.HORIZONTAL,
    history_enabled: true,

    textarea_padding : 16,
    textarea_io_ratio : [2048, 2048],
    remember_deleted_session_count: 30,
    confirm_on_session_close: false,
    max_history_limit_per_session: 10000,
    max_history_storage_days: 0,
    global_shortcut_enabled: false,
    only_starred_models: false,
    show_actual_model_name: false,
    
    clear_on_submit_normal: false,
    clear_on_submit_chat: true,
};

interface ConfigState extends ConfigFields {
    commit: RefetchMethods<ConfigFields>;
    localUpdate: UpdateMethods<ConfigFields>;
    update: UpdateMethods<ConfigFields>;
    refetch: RefetchMethods<ConfigFields>;
    refetchAll : () => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set, get)=>{
    const {
        commit,
        localUpdate,
        update,
        refetch,
        refetchAll
    } = profileStoreTool<ConfigFields>(set, get, 'config.json', defaultConfig);

    return {
        ...defaultConfig,
        commit,
        localUpdate,
        update,
        refetch,
        refetchAll,
    };
});

export default useConfigStore;