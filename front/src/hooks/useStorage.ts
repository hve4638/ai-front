import { useState, useEffect, useCallback } from 'react';

type ExtraArgs = {
    storeData : (key:string, value:any) => Promise<void>,
    loadData : (key:string) => Promise<any>
    encode? : (value:any)=>string,
    decode? : (value: string | undefined)=>any,
    onStoreError? : (error: unknown) => void,
    onLoadError? : (error: unknown) => void,
}

export function useStorage(
    key:string,
    {
        encode,
        decode,
        onStoreError = (error: unknown) => console.error(error),
        onLoadError = (error: unknown) => console.error(error),
        storeData,
        loadData,
    }:ExtraArgs
): [any, (value: any) => void, ()=>void] {
    const [cacheValue, setCacheValue] = useState<any>(null);

    const refetchCache = useCallback(() => {
        setCacheValue(undefined);
        loadData(key)
            .then(data => setCacheValue(decode ? decode(data) : data))
            .catch((err) => {
                onLoadError(err);
                setCacheValue(undefined)
            });
    }, [key, decode, loadData, onLoadError]);

    const writeValue = useCallback((value: any) => {
        setCacheValue((prev:any) => {
            const newValue = typeof value === 'function' ? value(prev) : value;
            
            storeData(key, encode ? encode(newValue) : newValue)
                .catch((err) => {
                    onStoreError(err);
                    refetchCache();
                });
            return newValue;
        })
    }, [key, encode, storeData, onStoreError]);

    useEffect(() => {
        refetchCache();
    }, [refetchCache]);

    return [cacheValue, writeValue, refetchCache];
};