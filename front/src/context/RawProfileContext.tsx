import React, { useState, createContext, useLayoutEffect } from 'react';
import { useProfileStorage } from 'hooks/profile'
import { SetState, ChatSession } from './types';

import { LayoutModes, ThemeModes } from 'types/profile';
import type { LastChats } from 'types/chat';

interface RawProfileContextType {
    // config.json
    fontSize: number;
    setFontSize: SetState<number>;
    
    themeMode: ThemeModes;
    setThemeMode: SetState<ThemeModes>;
    layoutMode: LayoutModes;
    setLayoutMode: SetState<LayoutModes>;
    
    // data.json
    sessions: ChatSession[];
    setSessions: SetState<ChatSession[]>;

    // 각 세션의 마지막 응답
    lastChats: LastChats;
    setLastChats: SetState<LastChats>;

    // cache.json
    promptVariables: any;
    setPromptVariables: SetState<any>;
    lastSessionId: number|null;
    setLastSessionId: SetState<number|null>;
}

/**
 * ProfileStorage 관리
 */
export const RawProfileContext = createContext<RawProfileContextType|null>(null);

const STORAGE_CONFIG = 'config.json';
const STORAGE_DATA = 'data.json';
const STORAGE_CACHE = 'cache.json';

export default function RawProfileContextProvider({
    profileName,
    children
}: {profileName:string, children:React.ReactNode}) {
    const useConfigStorage = <T,>(key:string, default_value:T) => {
        return useProfileStorage<T>(profileName!, STORAGE_CONFIG, key, { default_value });
    }
    const useDataStorage = <T,>(key:string, default_value:T) => {
        return useProfileStorage<T>(profileName!, STORAGE_DATA, key, { default_value });
    }
    const useCacheStorage = <T,>(key:string, default_value:T) => {
        return useProfileStorage<T>(profileName!, STORAGE_CACHE, key, { default_value });
    }

    /* config.json */
    // 입출력 폰트 크기
    const [fontSize, setFontSize, refetchFontSize] = useConfigStorage('fontsize', 18);
    // 테마 지정 (다크/라이트/시스템)
    const [themeMode, setThemeMode, refetchThemeMode] = useConfigStorage('theme_mode', ThemeModes.SYSTEM_DEFAULT);
    // 레이아웃 모드 (자동/모바일/데스크탑)
    const [layoutMode, setLayoutMode, refetchLayoutMode] = useConfigStorage('layout_mode', LayoutModes.AUTO);

    /* data.json */
    const [sessions, setSessions, refetchSessions] = useDataStorage<ChatSession[]>('sessions', []);

    /* cache.json */
    // 새션 별 마지막 채팅 및 응답 기록
    const [lastChats, setLastChats, refetchLastChats] = useCacheStorage<LastChats>('lastchats', {});
    // 마지막으로 선택한 프롬프트 변수
    const [promptVariables, setPromptVariables, refetchPromptVariables] = useCacheStorage('prompt_variables', {});

    const [lastSessionId, setLastSessionId, refetchLastSessionId] = useCacheStorage('last_session_id', null);


    useLayoutEffect(() => {
        refetchFontSize();
        refetchThemeMode();
        refetchLayoutMode();
        refetchSessions();
        refetchLastChats();
        refetchPromptVariables();
        refetchLastSessionId();
    }, [profileName]);
    
    return (
        <RawProfileContext.Provider
            value={{
                fontSize, setFontSize,
                themeMode, setThemeMode,
                layoutMode, setLayoutMode,
                //isGlobalHistoryVolatile, setIsGlobalHistoryVolatile,
                // overrideThemeMode, setOverrideThemeMode,
                // overrideLayoutMode, setOverrideLayoutMode,
                sessions, setSessions,
                lastSessionId, setLastSessionId,
                lastChats, setLastChats,
                promptVariables, setPromptVariables,
                // lastvar, setLastvar
            }}
        >
            {children}
        </RawProfileContext.Provider>
    )
}