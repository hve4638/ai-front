import { create } from 'zustand'
import { useProfileAPIStore } from './useProfileAPIStore';
import { Shortcut } from '@/types/shortcut';
import { UpdateMethods } from './types';
import { makeSetter } from './utils';

const defaultShortcuts = {
    font_size_up : { wheel: -1, ctrl: true },
    font_size_down : { wheel: 1, ctrl: true },
    send_request : { key: 'Enter', ctrl: true },
    copy_response : { key: 'c', ctrl: true, shift: true },
    next_tab : { key: 'Tab', ctrl: true },
    prev_tab : { key: 'Tab', ctrl: true, shift: true },
    create_tab : { key: 't', ctrl: true },
    remove_tab : { key: 'w', ctrl: true },
    undo_remove_tab : { key: 't', ctrl: true, shift: true },
    tab1 : { key: '1', ctrl: true },
    tab2 : { key: '2', ctrl: true },
    tab3 : { key: '3', ctrl: true },
    tab4 : { key: '4', ctrl: true },
    tab5 : { key: '5', ctrl: true },
    tab6 : { key: '6', ctrl: true },
    tab7 : { key: '7', ctrl: true },
    tab8 : { key: '8', ctrl: true },
    tab9 : { key: '9', ctrl: true },

    global_toggle_screen_activation : { key: 'e', ctrl: true, shift: true },
    global_request_clipboard : { key: 'v', ctrl: true, shift: true },
} satisfies Record<string, Shortcut>;

type ShortcutKeys = keyof typeof defaultShortcuts;

type ShortcutFields = Record<ShortcutKeys, Shortcut>;

interface ShortcutState extends ShortcutFields {
    update: UpdateMethods<ShortcutFields>;
}

const setter = makeSetter<ShortcutFields>('shortcuts.json');

export const useShortcutStore = create<ShortcutState>((set)=>({
    ...defaultShortcuts,

    update : {
        font_size_up : setter<Shortcut>(set, 'font_size_up'),
        font_size_down : setter<Shortcut>(set, 'font_size_down'),
        send_request : setter<Shortcut>(set, 'send_request'),
        copy_response : setter<Shortcut>(set, 'copy_response'),
        next_tab : setter<Shortcut>(set, 'next_tab'),
        prev_tab : setter<Shortcut>(set, 'prev_tab'),
        create_tab : setter<Shortcut>(set, 'create_tab'),
        remove_tab : setter<Shortcut>(set, 'remove_tab'),
        undo_remove_tab : setter<Shortcut>(set, 'undo_remove_tab'),
        tab1 : setter<Shortcut>(set, 'tab1'),
        tab2 : setter<Shortcut>(set, 'tab2'),
        tab3 : setter<Shortcut>(set, 'tab3'),
        tab4 : setter<Shortcut>(set, 'tab4'),
        tab5 : setter<Shortcut>(set, 'tab5'),
        tab6 : setter<Shortcut>(set, 'tab6'),
        tab7 : setter<Shortcut>(set, 'tab7'),
        tab8 : setter<Shortcut>(set, 'tab8'),
        tab9 : setter<Shortcut>(set, 'tab9'),

        global_toggle_screen_activation: setter<Shortcut>(set, 'global_toggle_screen_activation'),
        global_request_clipboard: setter<Shortcut>(set, 'global_request_clipboard')
    },
    refetchAll: async () => {
        const { api } = useProfileAPIStore.getState();
        const result:Record<string, unknown> = await api.get('shortcuts.json', [
            'font_size_up',
            'font_size_down',
            'send_request',
            'copy_response',
            'next_tab',
            'prev_tab',
            'create_tab',
            'remove_tab',
            'undo_remove_tab',
            'tab1',
            'tab2',
            'tab3',
            'tab4',
            'tab5',
            'tab6',
            'tab7',
            'tab8',
            'tab9',

            'global_toggle_screen_activation',
            'global_request_clipboard'
        ]);

        for (const key in result) {
            result[key] ??= defaultShortcuts[key];
        }
        set(result);
    }
}));
