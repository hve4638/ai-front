import React, { useState, createContext, useLayoutEffect, useEffect, useMemo } from 'react';
import { useContextForce } from './useContextForce';
import { RawProfileContext } from './RawProfileContext';
import { SetState } from './types';
import { LayoutModes, ThemeModes } from 'types/profile';
import { ChatSession } from 'types/chat-session';
import { ProfileContext } from './ProfileContext';
import { IProfileSession } from 'features/profiles';
import { useStorage } from 'hooks/useStorage';
import useThrottle from 'hooks/useThrottle';
import useSignal from 'hooks/useSignal';


interface RawProfileSessionContextType {
    profileSession: IProfileSession|undefined;
    sessionId:string;
    refetch:()=>void;

    /* cache */
    lastInput:string;
    setLastInput:SetState<string>;
    lastOutput:string;
    setLastOutput:SetState<string>;
    lastTokenCount:number;
    setLastTokenCount:SetState<number>;
    lastWarningMessage:string;
    setLastWarningMessage:SetState<string>;

    /* data */
    presetKey:string|null;
    setPresetKey:SetState<string|null>;
    promptKey:string;
    setPromptKey:SetState<string>;
    modelKey:string;
    setModelKey:SetState<string>;
    // batchQueue:string[];

    // /* config */
    // maxTokens:number;
    // setMaxTokens:SetState<number>;
    // temperature:number;
    // setTemperature:SetState<number>;
    // topP:number;
    // setTopP:SetState<number>;
}

/**
 * ProfileSession 관리
 * 
 * 세션 변경 시, 동기화를 위해 sessionId의 변화를 확인 후 값 참조 필요
 */
export const RawProfileSessionContext = createContext<RawProfileSessionContextType|null>(null);

export function RawProfileSessionContextProvider({children}: {children:React.ReactNode}) {
    const profileContext = useContextForce(ProfileContext);
    const {
        currentSession,
        getProfileSession,
    } = profileContext;

    const profileSession = useMemo(()=>{
        if (currentSession !== undefined) {
            return getProfileSession(currentSession.id);
        }
        else {
            return undefined;
        }
    }, [currentSession]);

    const useSessionStorage = <T,>(accessor:string, key:string, default_value:T) => {
        return useStorage(key, {
            encode: (value: any) => value,
            decode: (value: string | undefined) => value ?? default_value,
            onStoreError: (error: unknown) => console.error(error),
            onLoadError: (error: unknown) => console.error(error),
            store: async (key: string, value: any) => {
                profileSession?.setData(accessor, key, value);
            },
            load: async (key: string) => {
                return await profileSession?.getData(accessor, key);
            },
        });
    }
    const useConfigStorage = <T,>(key:string, default_value:T) => {
        return useSessionStorage<T>('config.json', key, default_value);
    }
    const useDataStorage = <T,>(key:string, default_value:T) => {
        return useSessionStorage<T>('data.json', key, default_value);
    }
    const useCacheStorage = <T,>(key:string, default_value:T) => {
        return useSessionStorage<T>('cache.json', key, default_value);
    }

    const [refetchSignal, sendRefetch] = useSignal();
    const [lazyProfileSession, setLazyProfileSession] = useState<IProfileSession|undefined>(undefined);
    const [sessionId, setSessionId] = useState('');

    /* cache */
    const [lastInput, setLastInput, refetchLastInput] = useCacheStorage('input', '');
    const [lastOutput, setLastOutput, refetchLastOutput] = useCacheStorage('output', '');
    const [lastTokenCount, setLastTokenCount, refetchTokenCount] = useCacheStorage('token_count', 0);
    const [lastWarningMessage, setLastWarningMessage, refetchWarningMessage] = useCacheStorage('warning_message', '');

    /* data */
    const [presetKey, setPresetKey, refetchPresetKey] = useDataStorage('preset_key', null);
    const [promptKey, setPromptKey, refetchPromptKey] = useDataStorage('prompt_key', '');
    const [modelKey, setModelKey, refetchModelKey] = useDataStorage('model_key', '');
    
    /* config */

    useEffect(()=>{
        if (!profileSession) return;

        (async ()=>{
            await refetchLastInput();
            await refetchLastOutput();
            await refetchTokenCount();
            await refetchWarningMessage();
            await refetchPresetKey();
            await refetchPromptKey();
            await refetchModelKey();
    
            setLazyProfileSession(profileSession);
            setSessionId(profileSession.id);
        })();
    }, [profileSession, refetchSignal]);

    return (
        <RawProfileSessionContext.Provider
            value={{
                profileSession : lazyProfileSession,
                sessionId,
                refetch : sendRefetch,

                lastInput, setLastInput,
                lastOutput, setLastOutput,
                lastTokenCount, setLastTokenCount,
                lastWarningMessage, setLastWarningMessage,

                presetKey, setPresetKey,
                promptKey, setPromptKey,
                modelKey, setModelKey,
            }}
        >
            {children}
        </RawProfileSessionContext.Provider>
    )
}