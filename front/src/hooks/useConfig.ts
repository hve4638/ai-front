import { useRawProfileStorage } from './useRawProfileStorage';

type ProfileStorageArgs<T> = {
    default_value?: T
}

/**
 * @returns [value, setValue, refetchCache]
 */
export function useProfileStorage<T>(
    profileName:string,
    category: string,
    key:string,
    { default_value }: ProfileStorageArgs<T>
): [any, (value: any) => void, ()=>void] {
    const encode = (value: any) => value
    const decode = (value: string | undefined) => value ?? default_value;
    return useRawProfileStorage(
        profileName,
        category,
        key,
        { encode, decode }
    );
};