import React, { useContext } from 'react'

class NoContextProviderError extends Error {
    constructor(contextProviderName?:string) {
        let message:string;
        if (contextProviderName) {
            message = 'No context provider found: ' + contextProviderName;
        }
        else {
            message = 'No context provider found';
        }
        
        super(message);
        this.name = 'NoContextProviderError';
    }
}

export default NoContextProviderError;
export function useContextForce<T>(context:React.Context<T | null>):T {
    const contextValue = useContext(context);
    if (!contextValue) throw new NoContextProviderError();
    return contextValue;
}