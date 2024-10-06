import React, { useContext } from "react";
import { NoContextProviderError } from "features/errors";

export { PromptContext } from './PromptContext'
export { StoreContext } from './StoreContext'
export { DebugContext } from './DebugContext'
export { EventContext } from './EventContext'
export { MemoryContext } from './MemoryContext'
export { SecretContext } from './SecretContext'
export type { ChatSession } from './interface'

export function useContextForce<T>(context:React.Context<T | null>):T {
    const contextValue = useContext(context);
    if (!contextValue) throw new NoContextProviderError();
    return contextValue;
}