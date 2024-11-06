import React, { useState, createContext } from 'react';
import { useProfileStorage } from 'hooks/profile'
import { LayoutModes, ThemeModes } from 'data/interface.ts';
import { ChatSession } from './interface';
import { SetState } from './types';

import type { LLMAPIResponse } from 'types';
import type { LastChats } from 'types/chat';

type Responses = {
    [key:number]: LLMAPIResponse;
}

interface RawProfileContextType {
    // config.json
    fontSize: number;
    setFontSize: SetState<number>;
    
    themeMode: ThemeModes;
    setThemeMode: SetState<ThemeModes>;
    layoutMode: LayoutModes;
    setLayoutMode: SetState<LayoutModes>;
    
    // 출력 마크다운 변환 여부
    markdownMode: boolean;
    setMarkdownMode: SetState<boolean>;

    sessions: ChatSession[];
    setSessions: SetState<ChatSession[]>;
    lastSessionId: number|null;
    setLastSessionId: SetState<number|null>;

    
    
    /** 각 세션의 마지막 응답 */
    lastChats: LastChats;
    setLastChats: SetState<LastChats>;

    // cache.json
    nextSessionID: number;
    setNextSessionID: SetState<number>;
    lastvar: any;
    setLastvar: SetState<any>;
}

/**
 * ProfileStorage 관리
 */
export const RawProfileContext = createContext<RawProfileContextType|null>(null);

const STORAGE_CONFIG = 'config.json';
const STORAGE_DATA = 'data.json';
const STORAGE_CACHE = 'cache.json';
export default function RawProfileContextProvider({profile, children}) {
    const useConfigStorage = <T,>(key:string, default_value:T) => {
        return useProfileStorage<T>(profile, STORAGE_CONFIG, key, { default_value });
    }
    const useDataStorage = <T,>(key:string, default_value:T) => {
        return useProfileStorage<T>(profile, STORAGE_DATA, key, { default_value });
    }
    const useCacheStorage = <T,>(key:string, default_value:T) => {
        return useProfileStorage<T>(profile, STORAGE_CACHE, key, { default_value });
    }
    // 입출력 폰트 크기
    const [fontSize, setFontSize, refetchFontSize] = useConfigStorage('fontsize', 18);
    // 테마 지정 (다크/라이트/시스템)
    const [themeMode, setThemeMode, refetchThemeMode] = useConfigStorage('themeMode', ThemeModes.SYSTEM_DEFAULT);
    // 레이아웃 모드 (자동/모바일/데스크탑)
    const [layoutMode, setLayoutMode, refetchLayoutMode] = useConfigStorage('layoutMode', LayoutModes.AUTO);
    // const [isGlobalHistoryVolatile, setIsGlobalHistoryVolatile, refetchIsGlobalHistoryVolatile] = useConfigStorage('isGlobalHistoryVolatile', false);
    //
    const [overrideThemeMode, setOverrideThemeMode, refetchOverrideThemeMode] = useConfigStorage('overrideThemeMode', false);
    const [overrideLayoutMode, setOverrideLayoutMode, refetchOverideLayoutMode] = useConfigStorage('overrideLayoutMode', false);
    const [markdownMode, setMarkdownMode, refetchMarkdownMode] = useConfigStorage('legacy_markdown', false);
    
    const [sessions, setSessions, refetchSessions] = useDataStorage<ChatSession[]>('sessions', []);
    const [lastChats, setLastChats, refetchLastChats] = useCacheStorage<LastChats>('lastchats', {});
    const [promptVariables, setPromptVariables, refetchPromptVariables] = useCacheStorage('prompt_variables', {});
    
    const [lastSessionId, setLastSessionId, refetchLastSessionId] = useCacheStorage('lastSessionId', null);
    const [nextSessionID, setNextSessionID, refetchNextSessionID] = useCacheStorage('nextsessionid', 0);
    const [lastvar, setLastvar, refetchLastvar] = useCacheStorage('lastvar', {});
    
    return (
        <RawProfileContext.Provider
            value={{
                fontSize, setFontSize,
                themeMode, setThemeMode,
                layoutMode, setLayoutMode,
                //isGlobalHistoryVolatile, setIsGlobalHistoryVolatile,
                overrideThemeMode, setOverrideThemeMode,
                overrideLayoutMode, setOverrideLayoutMode,
                markdownMode, setMarkdownMode,
                sessions, setSessions,
                lastSessionId, setLastSessionId,
                lastChats, setLastChats,
                nextSessionID, setNextSessionID,
                lastvar, setLastvar
            }}
        >
            {children}
        </RawProfileContext.Provider>
    )
}