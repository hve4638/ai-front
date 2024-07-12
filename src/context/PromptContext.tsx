import React, { useState } from "react";
import { createContext } from 'react';
import { MainPrompt, Vars } from '../data/interface.tsx'

import { EmptyPromptList } from "../features/prompts/index.ts";
import { IPromptList } from "../features/prompts/interface.ts";

interface PromptContextType {
    promptList : IPromptList,
    setPromptList: (x:IPromptList)=>void
}

export const PromptContext = createContext<PromptContextType|null>(null);

export default function PromptContextProvider({children}) {
    const [promptList, setPromptList] = useState<IPromptList>(new EmptyPromptList());

    return (
        <PromptContext.Provider
            value={{
                promptList, setPromptList
            }}
        >
            {children}
        </PromptContext.Provider>
    )
}