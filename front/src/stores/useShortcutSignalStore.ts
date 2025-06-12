import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { ActionMethods } from './types';
import { defaultShortcuts } from './useShortcutStore';
import { signalStoreTool } from './utils';

type ShortcutSignalKey = keyof typeof defaultShortcuts;
type ShortcutSignalFields = Record<ShortcutSignalKey, number>;

interface ShortcutSignalState extends ShortcutSignalFields {
    signal : ActionMethods<ShortcutSignalFields>;
}

export const useShortcutSignalStore = create<ShortcutSignalState, [['zustand/subscribeWithSelector', never]]>(
    subscribeWithSelector((set, get)=>{
        const {
            fields, signal
        } = signalStoreTool(set, get, defaultShortcuts);

        return {
            ...fields,
            signal,
        }
    })
);

export default useShortcutSignalStore;