import React, { useState, createContext } from "react";
import { DEBUG_MODE } from "data/constants.tsx";

interface DebugContextType {
    mirror: boolean;
    setMirror: (x: boolean) => void;
    isDebugMode: boolean;
}

export const DebugContext = createContext<DebugContextType|null>(null);

export default function PromptContextProvider({children}) {
    const [mirror, setMirror] = useState(false);
    const isDebugMode = DEBUG_MODE;

    return (
        <DebugContext.Provider
            value={{
                mirror,
                setMirror,
                isDebugMode
            }}
        >
            {children}
        </DebugContext.Provider>
    )
}