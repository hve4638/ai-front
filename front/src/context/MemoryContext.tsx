import React, { useState, createContext } from "react";

import { APIResponse } from 'data/interface'

import { HistoryManager } from "features/historyManager";
import { ChatSession, useStateCallback } from "./interface";
import {
    PromptMetadataTree,
    PromptMetadata,
    PromptMetadataSublist,
    IPromptMetadata
} from "features/prompts";

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
    promptMetadataTree:PromptMetadataTree;
    setPromptMetadataTree:(x:PromptMetadataTree)=>void;
    
    /**
     * @deprecated
     */
    promptMetadata:IPromptMetadata;
    /**
     * @deprecated
     */
    setPromptMetadata:(x:IPromptMetadata)=>void;

    promptMetadataSublist:PromptMetadataSublist|null;
    setPromptMetadataSublist:(x:PromptMetadataSublist|null)=>void;
    
    /**
     * @deprecated
     */
    promptText:string;
    /**
     * @deprecated
     */
    setPromptText:(x:string)=>void;


    currentSession:ChatSession;
    setCurrentSession:(x:ChatSession)=>void;
    currentHistory:APIResponse[];
    setCurrentHistory:useStateCallback<APIResponse[]>;
    currentChat:APIResponse;
    setCurrentChat:(x:APIResponse)=>void;
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
    
    return (
        <MemoryContext.Provider
            value={{
                promptMetadataTree, setPromptMetadataTree,
                promptMetadataSublist, setPromptMetadataSublist,

                promptText, setPromptText, // @TODO : 제거 예정

                currentSession, setCurrentSession,
                currentPromptMetadata, setCurrentPromptMetadata,
                promptMetadata : currentPromptMetadata, // 과거 코드 호환성
                setPromptMetadata : setCurrentPromptMetadata, // 과거 코드 호환성

                currentHistory, setCurrentHistory,
                currentChat, setCurrentChat,

                apiSubmitPing, setApiSubmitPing,
                
                apiFetchQueue, setApiFetchQueue,
                apiFetchBlock, setApiFetchBlock,
                apiFetchResponse, setApiFetchResponse,
                apiFetchWaiting, setApiFetchWaiting,
                
                sessionFetchStatus, setSessionFetchStatus,

                historyManager, setHistoryManager,

                errorLogs, setErrorLogs
            }}
        >
            {children}
        </MemoryContext.Provider>
    )
}