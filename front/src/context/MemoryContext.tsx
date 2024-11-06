import React, { useState, createContext } from 'react';

import { APIResponse } from 'data/interface'

import { HistoryManager } from 'features/historyManager';
import { ChatSession, useStateCallback } from './interface';
import {
    PromptMetadataTree,
    PromptMetadata,
    PromptMetadataSublist,
    IPromptMetadata
} from 'features/prompts';
import { Profile } from 'features/profiles';

type Dict<T> = { [key:string]:T };

interface ApiFetchResponse {
    [key:string]:{
        success : boolean;
        sessionid : any;
        data : APIResponse;
    };
}

interface ApiFetchWaiting {
    [key:string]:any;
}
interface SessionFetchStatus {
    [key:string]:any;
}

type ApiFetchQueueElement = {
    sessionid:number;
    input:string;
    promptText?:string;
    promptMetadata:IPromptMetadata;
};

type ErrorLog = {
    name: string;
    message: string;
}

interface MemoryContextType {
    /** 현 Profile의 PromptMetadataTree */
    promptMetadataTree:PromptMetadataTree;
    setPromptMetadataTree:(x:PromptMetadataTree)=>void;
    
    apiSubmitPing:boolean;
    setApiSubmitPing:(x:boolean)=>void;

    currentPromptMetadata:IPromptMetadata;
    setCurrentPromptMetadata:(x:IPromptMetadata)=>void;
    
    apiFetchQueue:ApiFetchQueueElement[];
    setApiFetchQueue:useStateCallback<ApiFetchQueueElement[]>;
    apiFetchBlock:boolean;
    setApiFetchBlock:(x:boolean)=>void;

    apiFetchWaiting:ApiFetchWaiting;
    setApiFetchWaiting:useStateCallback<ApiFetchWaiting>;

    apiFetchResponse:ApiFetchResponse;
    setApiFetchResponse:useStateCallback<ApiFetchResponse>;

    sessionFetchStatus:SessionFetchStatus;
    setSessionFetchStatus:useStateCallback<SessionFetchStatus>;

    historyManager:HistoryManager
    setHistoryManager:useStateCallback<HistoryManager>;

    errorLogs:ErrorLog[];
    setErrorLogs:useStateCallback<ErrorLog[]>;

    profile:Profile|null;
    setProfile:useStateCallback<Profile|null>;
}
const ANY:any = null;

/**
 * 프로그램 실행 동안만 존재하는 휘발성 정보 저장 컨텍스트
 */
export const MemoryContext = createContext<MemoryContextType|null>(null);

export default function MemoryContextProvider({children}) {
    const [promptMetadataTree, setPromptMetadataTree] = useState<PromptMetadataTree>(ANY);
    const [promptMetadataSublist, setPromptMetadataSublist] = useState<PromptMetadataSublist|null>(ANY);
    
    // @TODO 제거 예정
    const [promptText, setPromptText] = useState('');

    const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);

    const [currentPromptMetadata, setCurrentPromptMetadata] = useState<IPromptMetadata>(ANY);
    const [currentSession, setCurrentSession] = useState<ChatSession>(ANY);

    const [apiFetchQueue, setApiFetchQueue] = useState<any>([]);
    const [apiFetchResponse, setApiFetchResponse] = useState<any>([]);
    const [apiFetchBlock, setApiFetchBlock] = useState(false);
    
    const [currentChat, setCurrentChat] = useState(ANY);
    const [currentHistory, setCurrentHistory] = useState<APIResponse[]>([]);
    const [apiFetchWaiting, setApiFetchWaiting] = useState<ApiFetchWaiting>({});

    const [apiSubmitPing, setApiSubmitPing] = useState(false);
    const [sessionFetchStatus, setSessionFetchStatus] = useState({});

    const [historyManager, setHistoryManager] = useState<HistoryManager>(ANY);

    const [profile, setProfile] = useState<Profile|null>(null);
    
    return (
        <MemoryContext.Provider
            value={{
                promptMetadataTree, setPromptMetadataTree,

                currentPromptMetadata, setCurrentPromptMetadata,

                apiSubmitPing, setApiSubmitPing,
                
                apiFetchQueue, setApiFetchQueue,
                apiFetchBlock, setApiFetchBlock,
                apiFetchResponse, setApiFetchResponse,
                apiFetchWaiting, setApiFetchWaiting,
                
                sessionFetchStatus, setSessionFetchStatus,

                historyManager, setHistoryManager,

                errorLogs, setErrorLogs,

                profile, setProfile,
            }}
        >
            {children}
        </MemoryContext.Provider>
    )
}