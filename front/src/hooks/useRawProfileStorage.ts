import { useState, useEffect, useCallback } from 'react';

type ExtraArgs = {
    encode? : (value:any)=>string,
    decode? : (value: string | undefined)=>any,
    onStoreError? : (error: unknown) => void,
    storeAPI : (key:string, value:any) => Promise<void>,
    loadAPI : (key:string) => Promise<any>
}

export function useStorage(
    key:string,
    {
        encode = (value: any) => value,
        decode = (value: string | undefined) => value,
        onStoreError = (error: unknown) => console.error(error),
        loadAPI,
        storeAPI
    }:ExtraArgs
): [any, (value: any) => void, ()=>void] {
    const [cached, setCached] = useState<any>(undefined);

    const refetchCache = useCallback(() => {
        setCached(undefined);
        loadAPI(key)
            .then(data => setCached(decode(data)))
            .catch(() => setCached(undefined));
    }, [key, decode]);

    const writeValue = useCallback((value: any) => {
        setCached((prev:any) => {
            const newValue = typeof value === 'function' ? value(prev) : value;
            storeAPI(key, encode(newValue))
                .catch((err) => onStoreError(err));
            return newValue;
        })
    }, [key, encode]);

    useEffect(() => {
        refetchCache();
    }, [refetchCache]);

    return [cached, writeValue, refetchCache];
};