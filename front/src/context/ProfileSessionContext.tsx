import React, { useState, createContext, useLayoutEffect, useEffect, useMemo } from 'react';
import { SetState } from './types';
import { IProfileSession } from 'features/profilesAPI';

import { ProfileStorageContext, useContextForce } from 'context';

import useSignal from 'hooks/useSignal';
import { useStorage } from 'hooks/useStorage';
import { useProfile } from 'hooks/context';

interface RawProfileSessionContextType {
    profileSession: IProfileSession|undefined;
    sessionId:string;
    refetch:()=>void;

    /* cache */
    input:string;
    setInput:SetState<string>;
    output:string;
    setOutput:SetState<string>;
    tokenCount:number;
    setTokenCount:SetState<number>;
    warningMessage:string;
    setWarningMessage:SetState<string>;

    /* config */
    name:string|null;
    setName:SetState<string|null>;
    modelId:string;
    setModelId:SetState<string>;
    rtId:string;
    setRtId:SetState<string>;
}

/**
 * ProfileSession 관리
 * 
 * '현재 세션' 관리. 전체 세션 처리는 상위 Context에서 관리
 * 
 * 세션 변경 시 동기화를 위해 sessionId의 변화를 확인 후 값 참조 필요
 */
export const ProfileSessionContext = createContext<RawProfileSessionContextType|null>(null);

export function ProfileSessionContextProvider({children}: {children:React.ReactNode}) {
    const { api, lastSessionId } = useContextForce(ProfileStorageContext);
    const sessionAPI = useMemo(()=>{
        if (!api || !lastSessionId) return;
        return api.getSessionAPI(lastSessionId);
    }, [api, lastSessionId]);

    const useSessionStorage = <T,>(accessor:string, key:string, default_value:T) => {
        return useStorage(key, {
            encode: (value: any) => value,
            decode: (value: string | undefined) => value ?? default_value,
            onStoreError: (error: unknown) => console.error(error),
            onLoadError: (error: unknown) => console.error(error),
            store: async (key: string, value: any) => {
                sessionAPI?.set(accessor, { [key]: value });
            },
            load: async (key: string) => {
                return (await sessionAPI?.get(accessor, [key]))?.[key];
            },
        }, [lastSessionId, sessionAPI]);
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
    const [input, setInput, refetchInput] = useCacheStorage('input', '');
    const [output, setOutput, refetchOutput] = useCacheStorage('output', '');
    const [tokenCount, setTokenCount, refetchTokenCount] = useCacheStorage('token_count', 0);
    const [warningMessage, setWarningMessage, refetchWarningMessage] = useCacheStorage('warning_message', '');

    /* data */
    
    /* config */
    const [name, setName, refetchName] = useConfigStorage('name', null);
    const [modelId, setModelId, refetchModelId] = useConfigStorage('model_id', '');
    const [rtId, setRtId, refetchRtId] = useConfigStorage('rt_id', '');

    useEffect(()=>{
        if (!lastSessionId) return;

        setSessionId(lastSessionId);
        refetchInput();
        refetchOutput();
        refetchTokenCount();
        refetchWarningMessage();
        refetchName();
        refetchModelId();
        refetchRtId();
    }, [lastSessionId, refetchSignal]);

    const value:RawProfileSessionContextType = {
        profileSession : lazyProfileSession,
        refetch : sendRefetch,
        
        sessionId,

        input, setInput,
        output, setOutput,
        tokenCount, setTokenCount,
        warningMessage, setWarningMessage,

        name, setName,
        modelId, setModelId,
        rtId, setRtId,
    }

    return (
        <ProfileSessionContext.Provider
            value={value}
        >
            {children}
        </ProfileSessionContext.Provider>
    )
}