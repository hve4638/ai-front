import { Shortcut } from "types/shortcut";
import { SetStateAsync } from "./react";
import { LayoutModes, ThemeModes } from "types/profile";

export type Shortcuts = {
    fontSizeUp: Shortcut;
    setFrontSizeUp: SetStateAsync<Shortcut>;
    fontSizeDown: Shortcut;
    setFontSizeDown: SetStateAsync<Shortcut>;
    sendRequest: Shortcut;
    setSendRequest: SetStateAsync<Shortcut>;
    copyResponse: Shortcut;
    setCopyResponse: SetStateAsync<Shortcut>;
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