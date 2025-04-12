import { create } from 'zustand'
import { Shortcut } from '@/types/shortcut';
import { RefetchMethods, UpdateMethods } from './types';
import { profileStoreTool } from './utils';

export const defaultShortcuts = {
    font_size_up : { wheel: -1, ctrl: true },
    font_size_down : { wheel: 1, ctrl: true },
    send_request : { key: 'Enter', ctrl: true },
    copy_response : { key: 'KeyC', ctrl: true, shift: true },
    next_tab : { key: 'Tab', ctrl: true },
    prev_tab : { key: 'Tab', ctrl: true, shift: true },
    create_tab : { key: 'KeyT', ctrl: true },
    remove_tab : { key: 'KeyW', ctrl: true },
    undo_remove_tab : { key: 'KeyT', ctrl: true, shift: true },
    tab1 : { key: 'Digit1', ctrl: true },
    tab2 : { key: 'Digit2', ctrl: true },
    tab3 : { key: 'Digit3', ctrl: true },
    tab4 : { key: 'Digit4', ctrl: true },
    tab5 : { key: 'Digit5', ctrl: true },
    tab6 : { key: 'Digit6', ctrl: true },
    tab7 : { key: 'Digit7', ctrl: true },
    tab8 : { key: 'Digit8', ctrl: true },
    tab9 : { key: 'Digit9', ctrl: true },

    global_toggle_screen_activation : { key: 'e', ctrl: true, shift: true },
    global_request_clipboard : { key: 'v', ctrl: true, shift: true },
} satisfies Record<string, Shortcut>;

type ShortcutKeys = keyof typeof defaultShortcuts;

type ShortcutFields = Record<ShortcutKeys, Shortcut>;

interface ShortcutState extends ShortcutFields {
    update: UpdateMethods<ShortcutFields>;
    refetch: RefetchMethods<ShortcutFields>;
    refetchAll : () => Promise<void>;
}

const ACCESSOR_ID = 'shortcuts.json';

export const useShortcutStore = create<ShortcutState>((set, get)=>{
    const {
        update,
        refetch,
        refetchAll
    } = profileStoreTool<ShortcutFields>(set, get, ACCESSOR_ID, defaultShortcuts);

    return {
        ...defaultShortcuts,
    
        update,
        refetch,
        refetchAll,
    }
});

export default useShortcutStore;