import { useEffect, useMemo } from 'react';
import { useModal } from 'hooks/useModal';
import { Shortcut } from 'types/shortcut';
import { useConfigStore, useShortcutSignalStore } from '@/stores';
import useShortcutStore from '@/stores/useShortcutStore';
import useHotkey from '@/hooks/useHotkey';
import { v4 as uuidv4 } from 'uuid';


function ShortcutHandler() {
    const shortcuts = useShortcutStore();
    const updateConfigState = useConfigStore(state => state.update);
    const signalShortcut = useShortcutSignalStore(state => state.signal);

    const addHandler = (shortcut: Shortcut, callback: () => void, verbose: boolean = false, name: string = 'shortcut') => {
        const uuid = uuidv4();
        if (shortcut == null) return () => { };
        if (shortcut.key) {
            const handler = (e: KeyboardEvent) => {
                if (
                    e.isComposing === false // 한글 입력 중 두 번 이벤트 발생하는 경우 처리
                    && e.ctrlKey === (shortcut.ctrl ?? false)
                    && e.shiftKey === (shortcut.shift ?? false)
                    && e.altKey === (shortcut.alt ?? false)
                    && e.code === shortcut.key
                ) {
                    callback();
                }
            }

            window.addEventListener('keydown', handler);
            return () => {
                window.removeEventListener('keydown', handler);
            }
        }
        else if (shortcut.wheel) {
            const handler = (e: WheelEvent) => {
                if (
                    e.ctrlKey === (shortcut.ctrl ?? false)
                    && e.shiftKey === (shortcut.shift ?? false)
                    && e.altKey === (shortcut.alt ?? false)
                    && Math.sign(e.deltaY) === shortcut.wheel
                ) {
                    callback();
                }
            }

            window.addEventListener('wheel', handler);
            return () => {
                window.removeEventListener('wheel', handler);
            }
        }
        else {
            return () => { };
        }
    };

    useEffect(
        () => addHandler(shortcuts.font_size_up, () => {
            updateConfigState.font_size(prev => {
                const next = prev + 1;
                return next > 48 ? prev : next;
            });
        }),
        [shortcuts.font_size_up]
    );

    useEffect(
        () => addHandler(shortcuts.font_size_down, () => {
            updateConfigState.font_size(prev => {
                const next = prev - 1;
                return next < 6 ? prev : next;
            });
        }),
        [shortcuts.font_size_down]
    );

    useEffect(
        () => addHandler(shortcuts.send_request, () => signalShortcut.send_request(), true, 'send_request'),
        [shortcuts.send_request]
    );

    useEffect(
        () => addHandler(shortcuts.copy_response, () => signalShortcut.copy_response()),
        [shortcuts.copy_response]
    );
    useEffect(
        () => addHandler(shortcuts.create_tab, () => signalShortcut.create_tab()),
        [shortcuts.create_tab]
    );
    useEffect(
        () => addHandler(shortcuts.remove_tab, () => signalShortcut.remove_tab()),
        [shortcuts.remove_tab]
    );
    useEffect(
        () => addHandler(shortcuts.undo_remove_tab, () => signalShortcut.undo_remove_tab()),
        [shortcuts.undo_remove_tab]
    );
    useEffect(
        () => addHandler(shortcuts.next_tab, () => signalShortcut.next_tab()),
        [shortcuts.next_tab]
    );
    useEffect(
        () => addHandler(shortcuts.prev_tab, () => signalShortcut.prev_tab()),
        [shortcuts.prev_tab]
    );
    useEffect(
        () => addHandler(shortcuts.tab1, () => signalShortcut.tab1()),
        [shortcuts.tab1]
    );
    useEffect(
        () => addHandler(shortcuts.tab2, () => signalShortcut.tab2()),
        [shortcuts.tab2]
    );
    useEffect(
        () => addHandler(shortcuts.tab3, () => signalShortcut.tab3()),
        [shortcuts.tab3]
    );
    useEffect(
        () => addHandler(shortcuts.tab4, () => signalShortcut.tab4()),
        [shortcuts.tab4]
    );
    useEffect(
        () => addHandler(shortcuts.tab5, () => signalShortcut.tab5()),
        [shortcuts.tab5]
    );
    useEffect(
        () => addHandler(shortcuts.tab6, () => signalShortcut.tab6()),
        [shortcuts.tab6]
    );
    useEffect(
        () => addHandler(shortcuts.tab7, () => signalShortcut.tab7()),
        [shortcuts.tab7]
    );
    useEffect(
        () => addHandler(shortcuts.tab8, () => signalShortcut.tab8()),
        [shortcuts.tab8]
    );
    useEffect(
        () => addHandler(shortcuts.tab9, () => signalShortcut.tab9()),
        [shortcuts.tab9]
    );

    return (<></>);
}

export default ShortcutHandler;