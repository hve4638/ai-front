import { useState, useEffect, useCallback } from 'react';
import LocalAPI from 'api';

type ExtraArgs = {
    encode? : (value:any)=>string,
    decode? : (value: string | undefined)=>any,
    onStoreError? : (error: unknown) => void
}

export function useRawProfileStorage(
    profileName:string,
    category: string,
    key:string,
    {
        encode = (value: any) => value,
        decode = (value: string | undefined) => value,
        onStoreError = (error: unknown) => console.error(error)
    }:ExtraArgs
): [any, (value: any) => void, ()=>void] {
    const [cached, setCached] = useState<any>(undefined);

    const refetchCache = useCallback(() => {
        setCached(undefined);
        LocalAPI.loadProfileValue(profileName, category, key)
            .then(data => setCached(decode(data)))
            .catch(() => setCached(undefined));
    }, [profileName, category, key, decode]);

    const writeValue = useCallback((value: any) => {
        setCached((prev:any) => {
            const newValue = typeof value === 'function' ? value(prev) : value;
            LocalAPI.storeProfileValue(profileName, category, key, encode(newValue))
                .catch((err) => onStoreError(err));
            return newValue;
        })
    }, [profileName, category, key, encode]);

    useEffect(() => {
        refetchCache();
    }, [refetchCache]);

    return [cached, writeValue, refetchCache];
};