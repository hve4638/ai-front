import { useRawProfileStorage } from './useRawProfileStorage';

type ProfileStorageArgs<T> = {
    default_value?: T
}

/**
 * @returns [value, setValue, refetchCache]
 */
export function useProfileStorage<T>(
    profileId:string,
    storageId: string,
    key:string,
    { default_value }: ProfileStorageArgs<T>
): [T, (value: T) => void, ()=>void] {
    const encode = (value: any) => value
    const decode = (value: string | undefined) => value ?? default_value;
    
    return useRawProfileStorage(
        profileId,
        storageId,
        key,
        {
            encode, decode,
            onLoadError : (error: unknown) => {},
        }
    );
};