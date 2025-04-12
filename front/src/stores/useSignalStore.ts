import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { ActionMethods } from './types';

interface SignalFields {
    session_metadata:number;
}

interface SignalState extends SignalFields {
    signal : ActionMethods<SignalFields>;
}

export const useSignalStore = create<SignalState, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set)=>({
        session_metadata : 0,
        signal : {
            async session_metadata() {
                set(state=>({ ...state, session_metadata: state.session_metadata+1 }));
            },
        },
    }))
);

export default useSignalStore;