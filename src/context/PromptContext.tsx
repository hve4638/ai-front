import React, { useState } from "react";
import { createContext } from 'react';

import { EmptyPromptList } from "features/prompts";
import { IPromptList } from "features/prompts/interface";

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