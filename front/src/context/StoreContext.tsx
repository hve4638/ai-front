import React, { useState, createContext } from 'react';
import { LayoutModes, ThemeModes } from 'data/interface.ts';

import { ChatSession, SessionHistory, SessionResponse, useStateCallback } from './interface.ts';

interface StoreContextType {
}

/**
 * 쿠키 또는 파일시스템애 저장되는 상태값 컨텍스트
 */
export const StoreContext = createContext<StoreContextType|null>(null);

export default function StoreContextProvider({profile, children}) {
    const CATEGORY_CONFIG = 'config.json';

    // const [currentSessionId, setCurrentSessionId, refetchCurrentSessionId] = useProfileValue(profile, CATEGORY_CONFIG, 'currentSessionId', null);
    // const [sessions, setSessions, refetchSessions] = useProfileValue(profile, CATEGORY_CONFIG, 'sessions', []);
    // const [history, setHistory] = useState({});
    // const [responses, setResponses, refetchResponses] = useProfileValue(profile, CATEGORY_CONFIG, 'responses', {});
    // const [fontSize, setFontSize, refetchFontSize] = useProfileValue(profile, CATEGORY_CONFIG, 'fontsize', 18);
    // const [themeMode, setThemeMode, refetchThemeMode] = useProfileValue(profile, CATEGORY_CONFIG, 'themeMode', ThemeModes.SYSTEM_DEFAULT);
    // const [layoutMode, setLayoutMode, refetchLayoutMode] = useProfileValue(profile, CATEGORY_CONFIG, 'layoutMode', LayoutModes.AUTO);
    // const [nextSessionID, setNextSessionID, refetchNextSessionID] = useProfileValue(profile, CATEGORY_CONFIG, 'nextsessionid', 0);
    // const [isGlobalHistoryVolatile, setIsGlobalHistoryVolatile, refetchIsGlobalHistoryVolatile] = useProfileValue(profile, CATEGORY_CONFIG, 'isGlobalHistoryVolatile', false);
    // const [lastvar, setLastvar, refetchLastvar] = useProfileValue(profile, CATEGORY_CONFIG, 'lastvar', {});

    // const [markdownMode, setMarkdownMode, refetchMarkdownMode] = useProfileValue(profile, CATEGORY_CONFIG, 'markdown', false);
    // const [lineByLineMode, setLineByLineMode, refetchLineByLineMode] = useProfileValue(profile, CATEGORY_CONFIG, 'linebyline', false);
    
    return (
        <StoreContext.Provider
            value={{
            }}
        >
            {children}
        </StoreContext.Provider>
    )
}