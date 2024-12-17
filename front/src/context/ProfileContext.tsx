import React, { useState, createContext, useLayoutEffect } from 'react';
import { useProfileStorage } from 'hooks/profile'
import { SetState, ChatSession } from './types';

import { LayoutModes, ThemeModes } from 'types/profile';
import type { LastChats } from 'types/chat';
import { useContextForce } from './useContextForce';
import { RawProfileContext } from './RawProfileContext';

interface ProfileContextType {
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
export const ProfileContext = createContext<ProfileContextType|null>(null);

export default function RawProfileContextProvider({children}: {children:React.ReactNode}) {
    const rawProfileContext = useContextForce(RawProfileContext);

    const createTab = () => {

    }
    const removeTab = () => {

    }
    const changeTabOrder = () => {

    }

    const value:ProfileContextType = {
        fontSize: rawProfileContext.fontSize,
        setFontSize: rawProfileContext.setFontSize,
        themeMode: rawProfileContext.themeMode,
        setThemeMode: rawProfileContext.setThemeMode,
        layoutMode: rawProfileContext.layoutMode,
        setLayoutMode: rawProfileContext.setLayoutMode,
        sessions: rawProfileContext.sessions,
        setSessions: rawProfileContext.setSessions,
        lastChats: rawProfileContext.lastChats,
        setLastChats: rawProfileContext.setLastChats,
        promptVariables: rawProfileContext.promptVariables,
        setPromptVariables: rawProfileContext.setPromptVariables,
        lastSessionId: rawProfileContext.lastSessionId,
        setLastSessionId: rawProfileContext.setLastSessionId,        
    };
    
    return (
        <RawProfileContext.Provider
            value={value}
        >
            {children}
        </RawProfileContext.Provider>
    )
}