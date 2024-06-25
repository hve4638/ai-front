import React, { useEffect, useState } from "react";
import { createContext } from 'react';
import { APIResponse } from "../data/interface";
import { useEncryptedCookie } from '../hooks/useEncryptedCookie.tsx';
import { usePlainCookie } from '../hooks/usePlainCookie.tsx'
import { ENCRYPT_KEY, COOKIE_OPTION_NOEXPIRE } from "../data/constants.tsx";
import { useObjectCookie } from "../hooks/useObjectCookie.tsx";

interface Slot {
    prompt1:string|undefined,
    prompt2:string|undefined,
    note: Note,
    extra: Object
}

interface Note {
    [key: string]: string;
}

interface StateContextType {
    promptSlots:Slot[],
    setPromptSlots:(slot:Slot[])=>void,
    requireVars:string[],
    setRequireVars: (X:string[]) => void,
    prompt : any,
    setPrompt : (x:any)=>void,
    promptContents : string,
    setPromptContents : (X:string) => void,
    note: Note,
    setNote: (X:Note) => void
    history: APIResponse[],
    setHistory: (x:APIResponse[])=>void,
    prompt1Key: string|undefined,
    setPrompt1Key : (key:string)=>void,
    prompt2Key: string|undefined,
    setPrompt2Key : (key:string)=>void,
    markdownMode: boolean,
    setMarkdownMode : (x:boolean)=>void,
    lineByLineMode : boolean,
    setLineByLineMode : (x:boolean)=>void
}

export const StateContext = createContext<StateContextType|undefined>(undefined);

export default function StateContextProvider({children}) {
    const [promptSlots, setPromptSlots] = usePlainCookie('slots');
    const [prompt1Key, setPrompt1Key] = usePlainCookie('prompt1');
    const [prompt2Key, setPrompt2Key] = usePlainCookie('prompt2');
    const [requireVars, setRequireVars] = useState<string[]>([]);
    const [prompt, setPrompt] = useState(null);
    const [promptContents, setPromptContents] = useState('');
    const [markdownMode, setMarkdownMode] = usePlainCookie('markdown', false);
    const [lineByLineMode, setLineByLineMode] = usePlainCookie('linebyline', false);
    const [note, setNote] = usePlainCookie('note', {});
    const [history, setHistory] = useState<APIResponse[]>([]);
    
    return (
        <StateContext.Provider
            value={{
                promptSlots : promptSlots ?? [],
                setPromptSlots: (value)=>setPromptSlots(value, COOKIE_OPTION_NOEXPIRE),
                requireVars, setRequireVars,
                promptContents, setPromptContents,
                note, setNote,
                history, setHistory,
                prompt, setPrompt,
                prompt1Key,
                prompt2Key,
                setPrompt1Key : (value)=>setPrompt1Key(value, COOKIE_OPTION_NOEXPIRE),
                setPrompt2Key : (value)=>setPrompt2Key(value, COOKIE_OPTION_NOEXPIRE),
                markdownMode,
                setMarkdownMode : (value)=>setMarkdownMode(value, COOKIE_OPTION_NOEXPIRE),
                lineByLineMode,
                setLineByLineMode : (value)=>setLineByLineMode(value, COOKIE_OPTION_NOEXPIRE),
            }}
        >
            {children}
        </StateContext.Provider>
    )
}