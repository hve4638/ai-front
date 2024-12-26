import { useCallback } from 'react';
import LocalAPI from 'api/local';
import { useStorage } from 'hooks/useStorage';

type ExtraArgs = {
    encode? : (value:any)=>string,
    decode? : (value: string | undefined)=>any,
    onStoreError? : (error: unknown) => void,
    onLoadError? : (error: unknown) => void,
}

export function useRawProfileStorage(
    profileName:string,
    category: string,
    key:string,
    {
        encode = (value: any) => value,
        decode = (value: string | undefined) => value,
        onStoreError = (error: unknown) => console.error(error),
        onLoadError  = (error: unknown) => console.error(error),
    }:ExtraArgs
): [any, (value: any) => void, ()=>void] {
    const store = useCallback(
        (key: string, value: any) => LocalAPI.setProfileData(profileName, category, key, value),
        [profileName, category]
    );
    const load = useCallback(
        (key: string) => {
            return LocalAPI.getProfileData(profileName, category, key);
        },
        [profileName, category]
    );

    const [value, setValue, refetch] = useStorage(key, {
        encode, decode,
        onStoreError, onLoadError,
        store, load
    });

    return [value, setValue, refetch];
};