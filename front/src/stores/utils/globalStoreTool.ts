import { RefetchMethods, UpdateMethods } from '../types';
import LocalAPI from '@/api/local';

type ZustandSet<T> = (next:Partial<T> | ((prev:any)=>any) )=>void
type ZustandGet<T> = ()=>T

export function globalStoreTool<FIELDS extends object>(set:ZustandSet<FIELDS>, get:ZustandGet<FIELDS>, accessorId:string, fields:FIELDS):{
    commit: RefetchMethods<FIELDS>;
    localUpdate: UpdateMethods<FIELDS>;
    update: UpdateMethods<FIELDS>;
    refetch: RefetchMethods<FIELDS>;
    refetchAll : () => Promise<void>;
} {
    const keys = Object.keys(fields) as (keyof FIELDS)[];

    const committer = <T>(name:keyof FIELDS) => {
        return async () => {
            const next = get()[name];
            await LocalAPI.globalStorage.set(accessorId, { [name]: next });
        }
    }
    const localSetter = <T>(name:keyof FIELDS) => {
        return async (value: T|((prev:T)=>T) ) => {
            if (typeof value === 'function') {
                const call = value as (prev:T)=>T;
                set((state)=>({ [name] : call(state[name]) }));
            }
            else {
                set({ [name]: value } as Partial<FIELDS>);
            }
        }
    }
    const setter = <T>(name:keyof FIELDS) => {
        return async (value: T|((prev:T)=>T) ) => {
            if (typeof value === 'function') {
                const call = value as (prev:T)=>T;
                set((state)=>({ [name] : call(state[name]) }));

                const next = get()[name];
                await LocalAPI.globalStorage.set(accessorId, { [name]: next });
            }
            else {
                set({ [name]: value } as Partial<FIELDS>);
                await LocalAPI.globalStorage.set(accessorId, { [name]: value });
            }
        } 
    }
    const refetcher = (name:keyof FIELDS) => {
        return async () => {
            const result:Record<string, unknown> = await LocalAPI.globalStorage.get(accessorId, [name as string]);

            result[name as string] ??= fields[name as string];

            set(result as Partial<FIELDS>);
        }
    }
    const commit = keys.reduce((acc:Partial<UpdateMethods<FIELDS>>, key) => {
        acc[key] = committer(key);
        return acc;
    }, {}) as RefetchMethods<FIELDS>;
    const localUpdate = keys.reduce((acc:Partial<UpdateMethods<FIELDS>>, key) => {
        acc[key] = localSetter(key);
        return acc;
    }, {}) as UpdateMethods<FIELDS>;
    const update = keys.reduce((acc:Partial<UpdateMethods<FIELDS>>, key) => {
        acc[key] = setter(key);
        return acc;
    }, {}) as UpdateMethods<FIELDS>;
    const refetch = keys.reduce((acc:Partial<RefetchMethods<FIELDS>>, key) => {
        acc[key] = refetcher(key);
        return acc;
    }, {}) as RefetchMethods<FIELDS>;

    const refetchAll = async () => {
        const result:Record<string, unknown> = await LocalAPI.globalStorage.get(accessorId, keys as string[]);

        for (const key in result) {
            result[key] ??= fields[key];
        }
        set(result as Partial<FIELDS>);
    }
    return {
        commit,
        localUpdate,
        update,
        refetch,
        refetchAll
    };
}