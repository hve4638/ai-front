import React, { useState } from "react";
import { createContext } from 'react';
import { MainPrompts, Vars } from '../data/interface.tsx'

import { EmptyPromptList } from "../features/prompts/index.ts";
import { IPromptList } from "../features/prompts/interface.ts";

interface PromptContextType {
    promptList : IPromptList,
    setPromptList: (x:IPromptList)=>void,
    prompts: MainPrompts[]; //legacy
    setPrompts: (mainPrompts: MainPrompts[]) => void; //legacy
    vars : Vars, //legacy
    setVars : (x:Vars) => void; //legacy
}

export const PromptContext = createContext<PromptContextType|null>(null);

export default function PromptContextProvider({children}) {
    const [promptList, setPromptList] = useState<IPromptList>(new EmptyPromptList());
    const [prompts, setPrompts] = useState<MainPrompts[]>([]);
    const [vars, setVars] = useState<Vars>({});

    return (
        <PromptContext.Provider
            value={{
                promptList, setPromptList,
                prompts, setPrompts,
                vars, setVars
            }}
        >
            {children}
        </PromptContext.Provider>
    )
}