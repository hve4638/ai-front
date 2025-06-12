import { ActionMethods } from '../types';

type ZustandSet<T> = (next:Partial<T> | ((prev:any)=>any))=>void
type ZustandGet<T> = ()=>T

export function signalStoreTool<STATES extends object, FIELDS extends Record<string, any>>(set:ZustandSet<STATES>, get:ZustandGet<STATES>, fields:FIELDS):{
    fields: Record<keyof FIELDS, number>;
    signal: ActionMethods<FIELDS>;
} {
    const setter = (name:keyof FIELDS) => {
        return async () => {
            set(state=>({ [name]: state[name]+1 }));
        }
    }

    const keys = Object.keys(fields) as (keyof FIELDS)[];
    const initFields = keys.reduce((acc, key)=>{
        acc[key] = 0;
        return acc;
    }, {} as Record<keyof FIELDS, number>);
    const signals = keys.reduce((acc, key)=>{
        acc[key] = setter(key);
        return acc;
    }, {} as ActionMethods<FIELDS>);

    return {
        fields : initFields,
        signal : signals,
    };
}