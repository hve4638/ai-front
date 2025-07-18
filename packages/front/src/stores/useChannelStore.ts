import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import Channel from '@hve/channel';
import { ActionMethods } from './types';

const channels = {
    request_ready: 0,
};
type ChannelFields = typeof channels;

type ChannelInstance = {
    [K in keyof ChannelFields]: Channel<ChannelFields[K]>;
}
type ChannelReset = {
    [K in keyof ChannelFields]: ()=>Channel<ChannelFields[K]>;
}

interface ChannelState {
    instance : ChannelInstance;
    reset: ChannelReset;
}

export const useChannelStore = create<ChannelState, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set)=>{
        const instances = Object.fromEntries(
            Object.entries(channels).map(([key])=>{
                return [key, new Channel()];
            }) as [keyof ChannelFields, Channel<unknown>][]
        ) as ChannelInstance;

        const resetters = Object.fromEntries(
            Object.entries(channels).map(
                ([key])=>[
                    key,
                    ()=>{
                        const channel = new Channel();
                        set((prev)=>({
                            ...prev,
                            instance : { ...prev.instance, [key] : channel }
                        }));
                        return channel;
                    }
                ]
            )
        ) as ChannelReset;

        return {
            instance : instances,
            reset : resetters,
        }
    })
);

export default useChannelStore;