import { Shortcut } from 'types/shortcut'
import { LayoutModes, ThemeModes } from 'types/profile'
import React from 'react'

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>
export type SetStateAsync<T> = (value: T|((prev:T)=>T)) => Promise<void>
export type Setter<T> = (value: T) => Promise<void>


export type Shortcuts = {
    fontSizeUp: Shortcut;
    setFrontSizeUp: Setter<Shortcut>;
    fontSizeDown: Shortcut;
    setFontSizeDown: Setter<Shortcut>;
    sendRequest: Shortcut;
    setSendRequest: SetStateAsync<Shortcut>;
    copyResponse: Shortcut;
    setCopyResponse: SetStateAsync<Shortcut>;
    nextTab: Shortcut;
    setNextTab: SetStateAsync<Shortcut>;
    prevTab: Shortcut;
    setPrevTab: SetStateAsync<Shortcut>;
    createTab: Shortcut;
    setCreateTab: SetStateAsync<Shortcut>;
    removeTab: Shortcut;
    setRemoveTab: SetStateAsync<Shortcut>;
    undoRemoveTab: Shortcut;
    setUndoRemoveTab: SetStateAsync<Shortcut>;
    tab1: Shortcut;
    setTab1: SetStateAsync<Shortcut>;
    tab2: Shortcut;
    setTab2: SetStateAsync<Shortcut>;
    tab3: Shortcut;
    setTab3: SetStateAsync<Shortcut>;
    tab4: Shortcut;
    setTab4: SetStateAsync<Shortcut>;
    tab5: Shortcut;
    setTab5: SetStateAsync<Shortcut>;
    tab6: Shortcut;
    setTab6: SetStateAsync<Shortcut>;
    tab7: Shortcut;
    setTab7: SetStateAsync<Shortcut>;
    tab8: Shortcut;
    setTab8: SetStateAsync<Shortcut>;
    tab9: Shortcut;
    setTab9: SetStateAsync<Shortcut>;

    globalToggleScreenActivation: Shortcut;
    setGlobalToggleScreenActivation: SetStateAsync<Shortcut>;
    globalRequestClipboard: Shortcut;
    setGlobalRequestClipboard: SetStateAsync<Shortcut>;
}

export type Configs = {
    fontSize: number;
    setFontSize: SetStateAsync<number>;
    themeMode: ThemeModes;
    setThemeMode: SetStateAsync<ThemeModes>;
    layoutMode: LayoutModes;
    setLayoutMode: SetStateAsync<LayoutModes>;
    rememberDeletedSessionCount: number;
    setRememberDeletedSessionCount: SetStateAsync<number>;
    confirmOnSessionClose: boolean;
    setConfirmOnSessionClose: SetStateAsync<boolean>;
    historyEnabled: boolean;
    setHistoryEnabled: SetStateAsync<boolean>;
    maxHistoryLimitPerSession: number;
    setMaxHistoryLimitPerSession: SetStateAsync<number>;
    maxHistoryStorageDays: number;
    setMaxHistoryStorageDays: SetStateAsync<number>;
    globalShortcutEnabled: boolean;
    setGlobalShortcutEnabled: SetStateAsync<boolean>;

    onlyStarredModels: boolean;
    setOnlyStarredModels: SetStateAsync<boolean>;
    showActualModelName: boolean;
    setShowActualModelName: SetStateAsync<boolean>;

    settingModelsShowFeatured: boolean;
    setSettingModelsShowFeatured: SetStateAsync<boolean>;
    settingModelsShowSnapshot: boolean;
    setSettingModelsShowSnapshot: SetStateAsync<boolean>;
    settingModelsShowExperimental: boolean;
    setSettingModelsShowExperimental: SetStateAsync<boolean>;
    settingModelsShowDeprecated: boolean;
    setSettingModelsShowDeprecated: SetStateAsync<boolean>;
}