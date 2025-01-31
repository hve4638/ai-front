import React, { useState, createContext, useLayoutEffect, useCallback } from 'react';
import { Configs, SetState, SetStateAsync, Shortcuts } from './types';

import { LayoutModes, ThemeModes } from 'types/profile';

import Profiles, { type Profile } from 'features/profiles';
import { useStorage } from 'hooks/useStorage';

interface RawProfileContextType {
    profile: Profile;

    /* config.json */
    configs:Configs,
    
    /* data.json */
    sessionIds: string[];
    refetchSessionIds: ()=>Promise<void>;
    starredModels: string[],
    setStarredModels: SetStateAsync<string[]>,

    /* cache.json */
    promptVariables: any;
    setPromptVariables: SetStateAsync<any>;
    lastSessionId: string|null|undefined;
    setLastSessionId: SetStateAsync<string|null|undefined>;

    /* shortcut.json */
    shortcuts: Shortcuts;
}

/**
 * ProfileStorage 관리
 */
export const RawProfileContext = createContext<RawProfileContextType|null>(null);

export function RawProfileContextProvider({
    profileId,
    children
}: {profileId:string, children:React.ReactNode}) {
    const [profile, setProfile] = useState<Profile>();
    const refetchList:(()=>Promise<void>)[] = [];
    
    const useProfileStorage = useCallback(<T,>(accessor:string, key:string, default_value:T) => {
        return useStorage(key, {
            encode: (value: any) => value,
            decode: (value: any) => value ?? default_value,
            store: async (key: string, value: any) => {
                profile?.setData(accessor, key, value);
            },
            load: async (key: string) => {
                return await profile?.getData(accessor, key);
            },
            onStoreError: (error: unknown) => console.error(error),
            onLoadError: (error: unknown) => console.error(error),
        });
    }, [profile]);
    const useSecretStorage = <T,>(key:string, default_value:T) => {
        const [state, setState, refetch] = useProfileStorage<T>('secret.json', key, default_value);

        refetchList.push(refetch);
        return [state, setState, refetch]
    }
    const useConfigStorage = <T,>(key:string, default_value:T) => {
        const [state, setState, refetch] = useProfileStorage<T>('config.json', key, default_value);

        refetchList.push(refetch);
        return [state, setState, refetch]
    }
    const useDataStorage = <T,>(key:string, default_value:T) => {
        const [state, setState, refetch] = useProfileStorage<T>('data.json', key, default_value);
        
        refetchList.push(refetch);
        return [state, setState, refetch]
    }
    const useCacheStorage = <T,>(key:string, default_value:T) => {
        const [state, setState, refetch] = useProfileStorage<T>('cache.json', key, default_value);
        
        refetchList.push(refetch);
        return [state, setState, refetch]
    }
    const useShortcutStorage = <T,>(key:string, default_value:T) => {
        const [state, setState, refetch] = useProfileStorage<T>('shortcut.json', key, default_value);
        
        refetchList.push(refetch);
        return [state, setState, refetch]
    }

    /* cache.json */
    const [lastSessionId, setLastSessionId, refetchLastSessionId] = useCacheStorage('last_session_id', null);
    const [promptVariables, setPromptVariables, refetchPromptVariables] = useCacheStorage('prompt_variables', {});
    const settingModelsShowFeatured = useCacheStorage('setting_models_show_featured', true);
    const settingModelsShowSnapshot = useCacheStorage('setting_models_show_snapshot', false);
    const settingModelsShowExperimental = useCacheStorage('setting_models_show_experimental', false);
    const settingModelsShowDeprecated = useCacheStorage('setting_models_show_deprecated', false);


    /* config.json */
    const configFontSize = useConfigStorage('font_size', 18);
    const configThemeMode = useConfigStorage('theme_mode', ThemeModes.SYSTEM_DEFAULT);
    const configLayoutMode = useConfigStorage('layout_mode', LayoutModes.AUTO);
    const configRememberDeletedSessionCount = useConfigStorage('remember_deleted_session_count', 30);
    const configConfirmOnSessionClose = useConfigStorage('confirm_on_session_close', false);
    const configHistoryEnabled = useConfigStorage('history_enabled', true);
    const configMaxHistoryLimitPerSession = useConfigStorage('max_history_limit_per_session', 10000);
    const configMaxHistoryStorageDays =  useConfigStorage('max_history_storage_days', 0);
    const configGlobalShortcutEnabled = useConfigStorage('global_shortcut_enabled', false);
    const onlyStarredModels = useConfigStorage('only_starred_models', false);
    const configShowActualModelName = useConfigStorage('show_actual_model_name', false);
    const configs:Configs = {
        fontSize : configFontSize[0],
        setFontSize : configFontSize[1],
        themeMode : configThemeMode[0],
        setThemeMode : configThemeMode[1],
        layoutMode : configLayoutMode[0],
        setLayoutMode : configLayoutMode[1],
        rememberDeletedSessionCount : configRememberDeletedSessionCount[0],
        setRememberDeletedSessionCount : configRememberDeletedSessionCount[1],
        confirmOnSessionClose : configConfirmOnSessionClose[0],
        setConfirmOnSessionClose : configConfirmOnSessionClose[1],
        historyEnabled : configHistoryEnabled[0],
        setHistoryEnabled : configHistoryEnabled[1],
        maxHistoryLimitPerSession : configMaxHistoryLimitPerSession[0],
        setMaxHistoryLimitPerSession : configMaxHistoryLimitPerSession[1],
        maxHistoryStorageDays : configMaxHistoryStorageDays[0],
        setMaxHistoryStorageDays : configMaxHistoryStorageDays[1],
        globalShortcutEnabled : configGlobalShortcutEnabled[0],
        setGlobalShortcutEnabled : configGlobalShortcutEnabled[1],

        onlyStarredModels : onlyStarredModels[0],
        setOnlyStarredModels : onlyStarredModels[1],
        showActualModelName : configShowActualModelName[0],
        setShowActualModelName : configShowActualModelName[1],

        settingModelsShowSnapshot : settingModelsShowSnapshot[0],
        setSettingModelsShowSnapshot : settingModelsShowSnapshot[1],
        settingModelsShowExperimental : settingModelsShowExperimental[0],
        setSettingModelsShowExperimental : settingModelsShowExperimental[1],
        settingModelsShowDeprecated : settingModelsShowDeprecated[0],
        setSettingModelsShowDeprecated : settingModelsShowDeprecated[1],
        
        settingModelsShowFeatured : settingModelsShowFeatured[0],
        setSettingModelsShowFeatured : settingModelsShowFeatured[1],
    }

    /* secret.json */


    /* data.json */
    const [sessionIds, setSessionIds, refetchSessionIds] = useDataStorage<string[]>('sessions', []);
    const [starredModels, setStarredModels, refetchStarredModels] = useDataStorage<string[]>('starred_models', []);

    /* shortcut.json */
    const scFontSizeUp = useShortcutStorage('font_size_up', { wheel: -1, ctrl: true });
    const scFontSizeDown = useShortcutStorage('font_size_down', { wheel: 1, ctrl: true });
    const scSendRequest = useShortcutStorage('send_request', { key: 'Enter', ctrl: true });
    const scCopyResponse = useShortcutStorage('copy_response', { key: 'c', ctrl: true, shift: true });
    const scNextTab = useShortcutStorage('next_tab', { key: 'Tab', ctrl: true });
    const scPrevTab = useShortcutStorage('prev_tab', { key: 'Tab', ctrl: true, shift: true });
    const scCreateTab = useShortcutStorage('create_tab', { key: 't', ctrl: true });
    const scRemoveTab = useShortcutStorage('remove_tab', { key: 'w', ctrl: true });
    const scUndoRemoveTab = useShortcutStorage('undo_remove_tab', { key: 't', ctrl: true, shift: true });
    const scTab1 = useShortcutStorage('tab1', { key: '1', ctrl: true });
    const scTab2 = useShortcutStorage('tab2', { key: '2', ctrl: true });
    const scTab3 = useShortcutStorage('tab3', { key: '3', ctrl: true });
    const scTab4 = useShortcutStorage('tab4', { key: '4', ctrl: true });
    const scTab5 = useShortcutStorage('tab5', { key: '5', ctrl: true });
    const scTab6 = useShortcutStorage('tab6', { key: '6', ctrl: true });
    const scTab7 = useShortcutStorage('tab7', { key: '7', ctrl: true });
    const scTab8 = useShortcutStorage('tab8', { key: '8', ctrl: true });
    const scTab9 = useShortcutStorage('tab9', { key: '9', ctrl: true });

    const scGlobalToggleScreenActivation = useShortcutStorage('global_toggle_screen_activation', { key: 'e', ctrl: true, shift: true });
    const scGlobalRequestClipboard = useShortcutStorage('global_request_clipboard', { key: 'v', ctrl: true, shift: true });
    const shortcuts:Shortcuts = {
        fontSizeUp : scFontSizeUp[0],
        setFrontSizeUp : scFontSizeUp[1],
        fontSizeDown : scFontSizeDown[0],
        setFontSizeDown : scFontSizeDown[1],
        sendRequest : scSendRequest[0],
        setSendRequest : scSendRequest[1],
        copyResponse : scCopyResponse[0],
        setCopyResponse : scCopyResponse[1],
        nextTab : scNextTab[0],
        setNextTab : scNextTab[1],
        prevTab : scPrevTab[0],
        setPrevTab : scPrevTab[1],
        createTab : scCreateTab[0],
        setCreateTab : scCreateTab[1],
        removeTab : scRemoveTab[0],
        setRemoveTab : scRemoveTab[1],
        undoRemoveTab : scUndoRemoveTab[0],
        setUndoRemoveTab : scUndoRemoveTab[1],
        tab1 : scTab1[0],
        setTab1 : scTab1[1],
        tab2 : scTab2[0],
        setTab2 : scTab2[1],
        tab3 : scTab3[0],
        setTab3 : scTab3[1],
        tab4 : scTab4[0],
        setTab4 : scTab4[1],
        tab5 : scTab5[0],
        setTab5 : scTab5[1],
        tab6 : scTab6[0],
        setTab6 : scTab6[1],
        tab7 : scTab7[0],
        setTab7 : scTab7[1],
        tab8 : scTab8[0],
        setTab8 : scTab8[1],
        tab9 : scTab9[0],
        setTab9 : scTab9[1],

        globalToggleScreenActivation : scGlobalToggleScreenActivation[0],
        setGlobalToggleScreenActivation : scGlobalToggleScreenActivation[1],
        globalRequestClipboard : scGlobalRequestClipboard[0],
        setGlobalRequestClipboard : scGlobalRequestClipboard[1],
    }
    
    useLayoutEffect(() => {
        (async () => {
            const newProfile = await Profiles.getProfile(profileId)
            setProfile(newProfile);
        })();
    }, [profileId]);

    useLayoutEffect(() => {
        if (profile == null) {
            return;
        }
        else {
            refetchList.forEach((refetch)=>refetch());
        }

    }, [profile]);
    
    return (
        <RawProfileContext.Provider
            value={{
                profile: profile!,
                
                sessionIds, refetchSessionIds,

                lastSessionId, setLastSessionId,
                promptVariables, setPromptVariables,
                starredModels, setStarredModels,
                
                configs,
                shortcuts,
            }}
        >
            {children}
        </RawProfileContext.Provider>
    )
}