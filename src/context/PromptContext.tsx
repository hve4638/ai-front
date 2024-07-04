import React, { useState } from "react";
import { createContext } from 'react';
import { MainPrompts, Vars } from '../data/interface.tsx'

import { EmptyPromptList } from "../features/promptList/index.ts";
import { IPromptList } from "../features/promptList/interface.ts";

interface PromptContextType {
    promptList : IPromptList,
    setPromptList: (x:IPromptList)=>void,
    prompts: MainPrompts[];
    setPrompts: (mainPrompts: MainPrompts[]) => void;
    vars : Vars,
    setVars : (x:Vars) => void;
}

export const PromptContext = createContext<PromptContextType|null>(null);

export default function PromptContextProvider({children}) {
    const [promptList, setPromptList] = useState<IPromptList>(new EmptyPromptList());
    const [prompts, setPrompts] = useState<MainPrompts[]>([]);
    const [vars, setVars] = useState<Vars>(new Map());

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