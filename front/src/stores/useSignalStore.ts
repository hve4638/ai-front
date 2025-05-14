import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { ActionMethods } from './types';

const signalFields = {
    session_metadata : 0,
    change_profile : 0,
    reload_input : 0,
    request : 0,
    request_ready : 0,
} as const;
type SignalFields = Record<keyof typeof signalFields, number>;

interface SignalState extends SignalFields {
    signal : ActionMethods<SignalFields>;
}

export const useSignalStore = create<SignalState, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set)=>{
        const updater = Object.fromEntries(
            Object.entries(signalFields).map(
                ([key, _])=>[key, async ()=>(set(state=>({ [key]: state[key]+1 })))]
            )
        ) as ActionMethods<SignalFields>;
        
        return {
            ...signalFields,
            signal : {
                ...updater,
            },
        }
    })
);

export default useSignalStore;