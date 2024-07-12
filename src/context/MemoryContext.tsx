import React, { useState } from "react";
import { createContext } from 'react';
import { APIResponse } from '../data/interface.ts'

import { IPromptInfomation, IPromptSubList } from "../features/prompts/interface.ts";
import { ChatSession } from "./interface.ts";
import { Chat } from "./interface.ts";

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
    setCurrentHistory:(x:APIResponse[])=>void;
    currentResponse:APIResponse;
    setCurrentResponse:(x:APIResponse)=>void;
    currentChat:Chat;
    setCurrentChat:(x:Chat)=>void;
    apiSubmitPing:boolean;
    setApiSubmitPing:(x:boolean)=>void;
}
const ANY:any = null;

export const MemoryContext = createContext<MemoryContextType|null>(null);

export default function PromptContextProvider({children}) {
    const [promptInfomation, setPromptInfomation] = useState<IPromptInfomation>(ANY);
    const [promptIndex, setPromptIndex] = useState([0, 0]);
    const [promptText, setPromptText] = useState('');
    const [currentSession, setCurrentSession] = useState<ChatSession>(ANY);
    const [promptSubList, setPromptSubList] = useState<IPromptSubList|null>(null);
    const [nextSessionID, setNextSessionID] = useState<number>(0);

    const [currentInput, setCurrentInput] = useState<string>("");
    
    const [currentResponse, setCurrentResponse] = useState(ANY);
    const [currentChat, setCurrentChat] = useState({input:'', output:''});
    const [currentHistory, setCurrentHistory] = useState<APIResponse[]>([]);
    const [apiSubmitPing, setApiSubmitPing] = useState(false);
    
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
                currentResponse, setCurrentResponse,
                currentChat, setCurrentChat,
                apiSubmitPing, setApiSubmitPing,
            }}
        >
            {children}
        </MemoryContext.Provider>
    )
}