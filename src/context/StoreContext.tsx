import React, { useState, createContext } from 'react';
import { usePlainCookie } from 'hooks/usePlainCookie.tsx'
import { LayoutModes, ThemeModes } from 'data/interface.ts';
import { COOKIE_OPTION_NOEXPIRE } from 'data/constants';

import { ChatSession, SessionHistory, SessionResponse, useStateCallback } from './interface.ts';

interface StoreContextType {
    sessions:ChatSession[];
    setSessions:(slot:ChatSession[])=>void;
    currentSessionId:number;
    setCurrentSessionId:(x:number)=>void;
    history: SessionHistory;
    setHistory: (x:SessionHistory)=>void;
    responses: SessionResponse;
    setResponses: (x:SessionResponse)=>void;
    fontSize: number;
    setFontSize: (x:number)=>void;
    layoutMode: string;
    setLayoutMode: (x:string)=>void;
    nextSessionID:number;
    setNextSessionID:(x:number)=>void;
    lastvar: {[key:string]:any};
    setLastvar:(x:{[key:string]:any})=>void;
    
    themeMode:ThemeModes;
    setThemeMode:(x:ThemeModes)=>void;
    isGlobalHistoryVolatile:boolean;
    setIsGlobalHistoryVolatile:(x:boolean)=>void;

    // @TODO : 리팩토링 필요
    markdownMode: boolean;
    setMarkdownMode : (x:boolean)=>void;
    lineByLineMode : boolean;
    setLineByLineMode : (x:boolean)=>void;
}

/**
 * 쿠키 또는 파일시스템애 저장되는 상태값 컨텍스트
 */
export const StoreContext = createContext<StoreContextType|null>(null);

export default function StoreContextProvider({children}) {
    const [currentSessionId, setCurrentSessionId] = usePlainCookie('currentSessionId', null);
    const [sessions, setSessions] = usePlainCookie('sessions', []);
    const [history, setHistory] = useState({});
    const [responses, setResponses] = usePlainCookie('responses', {});
    const [fontSize, setFontSize] = usePlainCookie('fontsize', 18);
    const [themeMode, setThemeMode] = usePlainCookie('themeMode', ThemeModes.SYSTEM_DEFAULT);
    const [layoutMode, setLayoutMode] = usePlainCookie('layoutMode', LayoutModes.AUTO);
    const [nextSessionID, setNextSessionID] = usePlainCookie('nextsessionid', 0);
    const [isGlobalHistoryVolatile, setIsGlobalHistoryVolatile] = usePlainCookie('isGlobalHistoryVolatile', false);
    const [lastvar, setLastvar] = usePlainCookie('lastvar', {});

    const [markdownMode, setMarkdownMode] = usePlainCookie('markdown', false);
    const [lineByLineMode, setLineByLineMode] = usePlainCookie('linebyline', false);
    
    return (
        <StoreContext.Provider
            value={{
                sessions, setSessions,
                currentSessionId, setCurrentSessionId,
                history, setHistory,
                responses, setResponses,
                fontSize, setFontSize,
                layoutMode, setLayoutMode,
                nextSessionID, setNextSessionID,
                themeMode, setThemeMode,
                isGlobalHistoryVolatile, setIsGlobalHistoryVolatile,
                lastvar, setLastvar,

                markdownMode,
                setMarkdownMode : (value)=>setMarkdownMode(value, COOKIE_OPTION_NOEXPIRE),
                lineByLineMode,
                setLineByLineMode : (value)=>setLineByLineMode(value, COOKIE_OPTION_NOEXPIRE),
            }}
        >
            {children}
        </StoreContext.Provider>
    )
}