import { RefetchMethods, UpdateMethods } from '../types';
import useCacheStore from '../useCacheStore';
import useProfileAPIStore from '../useProfileAPIStore';

type ZustandSet<T> = (next:Partial<T>)=>void

export function sessionStoreTool<FIELDS extends object>(set:ZustandSet<FIELDS>, accessorId:string, fields:FIELDS):{
    update: UpdateMethods<FIELDS>;
    refetch: RefetchMethods<FIELDS>;
    refetchAll : () => Promise<void>;
} {
    const keys = Object.keys(fields) as (keyof FIELDS)[];

    const setter = <T>(name:keyof FIELDS) => {
        return async (value:T) => {
            const { api } = useProfileAPIStore.getState();
            const { last_session_id } = useCacheStore.getState();
            
            if (last_session_id == null) return;
            const sessionAPI = api.getSessionAPI(last_session_id);
        
            await sessionAPI.set(accessorId, { [name]: value });
            set({ [name]: value } as Partial<FIELDS>);
        }
    }
    const refetcher = (name:keyof FIELDS) => {
        return async () => {
            const { api } = useProfileAPIStore.getState();
            const { last_session_id } = useCacheStore.getState();
            
            if (last_session_id == null) return;
            const sessionAPI = api.getSessionAPI(last_session_id);

            const result:Record<string, unknown> = await sessionAPI.get(accessorId, [name as string]);
            result[name as string] ??= fields[name as string];

            set(result as Partial<FIELDS>);
        }
    }
    const update = keys.reduce((acc:Partial<UpdateMethods<FIELDS>>, key) => {
        acc[key] = setter(key);
        return acc;
    }, {}) as UpdateMethods<FIELDS>;
    const refetch = keys.reduce((acc:Partial<RefetchMethods<FIELDS>>, key) => {
        acc[key] = refetcher(key);
        return acc;
    }, {}) as RefetchMethods<FIELDS>;

    const refetchAll = async () => {
        const { api } = useProfileAPIStore.getState();
        const { last_session_id } = useCacheStore.getState();
            
        if (last_session_id == null) return;
        const sessionAPI = api.getSessionAPI(last_session_id);
        
        const result:Record<string, unknown> = await sessionAPI.get(accessorId, keys as string[]);
        for (const key in result) {
            result[key] ??= fields[key];
        }
        set(result as Partial<FIELDS>);
    }
    return {
        update,
        refetch,
        refetchAll
    };
}