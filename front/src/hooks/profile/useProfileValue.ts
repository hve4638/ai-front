import { useState, useEffect } from 'react';
import LocalAPI from 'api';

/**
 * @returns [value, setValue, refetchCache]
 */
export function useProfileValue(profileName:string, category: string, key:string, default_value: any = undefined): [any, (value: any) => void, ()=>void] {
    const encode = (value: any) => value
    const decode = (value: string | undefined) => value ?? default_value;
    const [cached, setCached] = useState<any>(undefined);

    useEffect(() => {
        refetchCache();
    }, [profileName, category, key]);

    const writeValue = (value: any) => {
        if (typeof value === 'function') {
            value = value(cached);
        }
        LocalAPI.storeProfileValue(profileName, category, key, encode(value));
        setCached(value);
    };

    const refetchCache = () => {
        setCached(undefined);
        LocalAPI.loadProfileValue(profileName, category, key)
            .then(data => setCached(decode(data)));
    }

    return [cached, writeValue, refetchCache];
};