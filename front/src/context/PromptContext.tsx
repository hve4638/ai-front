import React, { useState } from "react";
import { createContext } from 'react';
import { useContextForce } from "./useContextForce";

interface PromptContextType {
    promptList : any,
    setPromptList: (x:any)=>void
}

/**
 * 사용하지 않음
 */
export const PromptContext = createContext<PromptContextType|null>(null);

export default function PromptContextProvider({children}) {

    const [promptList, setPromptList] = useState<any>({} as any);

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