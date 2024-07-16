import React, { useEffect, useState } from "react";
import { createContext } from 'react';
import { LayoutModes, Note } from "../data/interface.ts";
import { usePlainCookie } from '../hooks/usePlainCookie.tsx'
import { COOKIE_OPTION_NOEXPIRE } from "../data/constants.tsx";
import { ChatSession, SessionHistory, SessionResponse, useStateCallback } from "./interface.ts";

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

    // @TODO : 리팩토링 필요
    markdownMode: boolean;
    setMarkdownMode : (x:boolean)=>void;
    lineByLineMode : boolean;
    setLineByLineMode : (x:boolean)=>void;
}

export const StoreContext = createContext<StoreContextType|undefined>(undefined);

export default function StoreContextProvider({children}) {
    const [currentSessionId, setCurrentSessionId] = usePlainCookie('currentSessionId', null);
    const [sessions, setSessions] = usePlainCookie('sessions', []);
    const [history, setHistory] = useState({});
    const [responses, setResponses] = usePlainCookie('responses', {});
    const [fontSize, setFontSize] = usePlainCookie('fontsize', 18);
    const [layoutMode, setLayoutMode] = usePlainCookie('layoutMode', LayoutModes.AUTO);
    const [nextSessionID, setNextSessionID] = usePlainCookie('nextsessionid', 0);

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