import React, { useState } from "react";
import { createContext } from 'react';
import { APIResponse } from '../data/interface.ts'

import { IPromptInfomation, IPromptSubList } from "../features/prompts/interface.ts";
import { ChatSession, useStateCallback } from "./interface.ts";

interface MemoryContextType {
    nextSessionID:number;
    setNextSessionID:(x:number)=>void;
    promptIndex:number[];
    setPromptIndex:(x:number[])=>void;
    promptInfomation:IPromptInfomation;
    setPromptInfomation:(x:IPromptInfomation)=>void;
    promptText:string;
    setPromptText:(x:string)=>void;
    currentSession:ChatSession;
    setCurrentSession:(x:ChatSession)=>void;
    promptSubList : IPromptSubList|null;
    setPromptSubList : (x:IPromptSubList|null)=>void;
    currentInput:string;
    setCurrentInput:(x:string)=>void;
    currentHistory:APIResponse[];
    setCurrentHistory:useStateCallback<APIResponse[]>;
    currentChat:APIResponse;
    setCurrentChat:(x:APIResponse)=>void;
    apiSubmitPing:boolean;
    setApiSubmitPing:(x:boolean)=>void;
    
    apiFetchQueue:any[];
    setApiFetchQueue:(x:any[]|((x:any)=>void))=>void;
    apiFetchBlock:boolean;
    setApiFetchBlock:(x:boolean)=>void;

    apiFetchWaiting:ApiFetchWaiting;
    setApiFetchWaiting:useStateCallback<ApiFetchWaiting>;

    apiFetchResponse:ApiFetchResponse;
    setApiFetchResponse:useStateCallback<ApiFetchResponse>;

    sessionFetchStatus:SessionFetchStatus;
    setSessionFetchStatus:useStateCallback<SessionFetchStatus>;
}
const ANY:any = null;

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

export const MemoryContext = createContext<MemoryContextType|null>(null);

export default function MemoryContextProvider({children}) {
    const [promptInfomation, setPromptInfomation] = useState<IPromptInfomation>(ANY);
    const [promptIndex, setPromptIndex] = useState([0, 0]);
    const [promptText, setPromptText] = useState('');
    const [currentSession, setCurrentSession] = useState<ChatSession>(ANY);
    const [promptSubList, setPromptSubList] = useState<IPromptSubList|null>(null);
    const [nextSessionID, setNextSessionID] = useState<number>(0);

    const [currentInput, setCurrentInput] = useState<string>("");
    const [apiFetchQueue, setApiFetchQueue] = useState<any>([]);
    const [apiFetchResponse, setApiFetchResponse] = useState<any>([]);
    const [apiFetchBlock, setApiFetchBlock] = useState(false);
    
    const [currentChat, setCurrentChat] = useState(ANY);
    const [currentHistory, setCurrentHistory] = useState<APIResponse[]>([]);
    const [apiFetchWaiting, setApiFetchWaiting] = useState<ApiFetchWaiting>({});

    const [apiSubmitPing, setApiSubmitPing] = useState(false);
    const [sessionFetchStatus, setSessionFetchStatus] = useState({});
    
    return (
        <MemoryContext.Provider
            value={{
                promptIndex, setPromptIndex,
                promptInfomation, setPromptInfomation,
                promptText, setPromptText,
                currentSession, setCurrentSession,
                promptSubList, setPromptSubList,
                nextSessionID, setNextSessionID,
                currentInput, setCurrentInput,
                currentHistory, setCurrentHistory,
                currentChat, setCurrentChat,
                apiSubmitPing, setApiSubmitPing,
                
                apiFetchQueue, setApiFetchQueue,
                apiFetchBlock, setApiFetchBlock,
                apiFetchResponse, setApiFetchResponse,
                apiFetchWaiting, setApiFetchWaiting,
                
                sessionFetchStatus, setSessionFetchStatus
            }}
        >
            {children}
        </MemoryContext.Provider>
    )
}