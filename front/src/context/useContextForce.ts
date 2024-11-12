import React, { useContext } from 'react'
import { NoContextProviderError } from './errors'

export function useContextForce<T>(context:React.Context<T | null>):T {
    const contextValue = useContext(context);
    if (!contextValue) throw new NoContextProviderError();
    return contextValue;
}