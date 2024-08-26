import React, { useState } from "react";
import { createContext } from 'react';

import { IPromptMetadataFormatParser } from "features/prompts";

interface PromptContextType {
    promptList : IPromptMetadataFormatParser,
    setPromptList: (x:IPromptMetadataFormatParser)=>void
}

export const PromptContext = createContext<PromptContextType|null>(null);

export default function PromptContextProvider({children}) {
    const [promptList, setPromptList] = useState<IPromptMetadataFormatParser>({} as any);

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