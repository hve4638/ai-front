import { create } from 'zustand'
import { useProfileAPIStore } from './useProfileAPIStore';
import { Shortcut } from '@/types/shortcut';
import { LayoutModes, ThemeModes } from '@/types/profile';
import { UpdateMethods } from './types';
import { makeSetter } from './utils';

interface ConfigFields {
    font_size: number;
    theme_mode: ThemeModes;
    layout_mode: LayoutModes;
    remember_deleted_session_count: number;
    confirm_on_session_close: boolean;
    history_enabled: boolean;
    max_history_limit_per_session: number;
    max_history_storage_days: number;
    global_shortcut_enabled: boolean;
    only_starred_models: boolean;
    show_actual_model_name: boolean;
}

const defaultConfig:ConfigFields = {
    font_size: 18,
    theme_mode: ThemeModes.SYSTEM_DEFAULT,
    layout_mode: LayoutModes.AUTO,
    remember_deleted_session_count: 30,
    confirm_on_session_close: false,
    history_enabled: true,
    max_history_limit_per_session: 10000,
    max_history_storage_days: 0,
    global_shortcut_enabled: false,
    only_starred_models: false,
    show_actual_model_name: false,
};

interface ConfigState extends ConfigFields {
    update: UpdateMethods<ConfigFields>;
}

const setter = makeSetter<ConfigFields>('config.json');

export const useConfigStore = create<ConfigState>((set)=>({
    ...defaultConfig,

    update : {
        font_size: setter<number>(set, 'font_size'),
        theme_mode: setter<ThemeModes>(set, 'theme_mode'),
        layout_mode: setter<LayoutModes>(set, 'layout_mode'),
        remember_deleted_session_count: setter<number>(set, 'remember_deleted_session_count'),
        confirm_on_session_close: setter<boolean>(set, 'confirm_on_session_close'),
        history_enabled: setter<boolean>(set, 'history_enabled'),
        max_history_limit_per_session: setter<number>(set, 'max_history_limit_per_session'),
        max_history_storage_days: setter<number>(set, 'max_history_storage_days'),
        global_shortcut_enabled: setter<boolean>(set, 'global_shortcut_enabled'),
        only_starred_models: setter<boolean>(set, 'only_starred_models'),
        show_actual_model_name: setter<boolean>(set, 'show_actual_model_name'),
    }
}));
