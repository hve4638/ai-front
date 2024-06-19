import React, { useState } from "react";
import { createContext } from 'react';
import { MainPrompts, Vars } from '../data/interface.tsx'

interface PromptContextType {
    prompts: MainPrompts[];
    setPrompts: (mainPrompts: MainPrompts[]) => void;
    vars : Vars,
    setVars : (x:Vars) => void;
}

export const PromptContext = createContext<PromptContextType|null>(null);

export default function PromptContextProvider({children}) {
    const [prompts, setPrompts] = useState<MainPrompts[]>([]);
    const [vars, setVars] = useState<Vars>(new Map());

    return (
        <PromptContext.Provider
            value={{ prompts, setPrompts, vars, setVars }}
        >
            {children}
        </PromptContext.Provider>
    )
}