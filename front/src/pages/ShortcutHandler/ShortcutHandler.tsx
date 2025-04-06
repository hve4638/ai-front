import { useEffect, useMemo } from 'react';
import { useModal } from 'hooks/useModal';
import { Shortcut } from 'types/shortcut';
import { useConfigStore, useProfileEvent } from '@/stores';
import useShortcutStore from '@/stores/useShortcutStore';

function ShortcutHandler() {
    const modals = useModal();
    const shortcuts = useShortcutStore();
    const configs = useConfigStore();

    const addHandler = (shortcut:Shortcut, callback) => {
        if (shortcut == null) return ()=>{};
        if (shortcut.key) {
            const handler = (e:KeyboardEvent) => {
                if (
                    e.ctrlKey === (shortcut.ctrl ?? false)
                    && e.shiftKey === (shortcut.shift ?? false)
                    && e.altKey === (shortcut.alt ?? false)
                    && e.key.toLowerCase() === shortcut.key?.toLowerCase()
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
            const handler = (e:WheelEvent) => {
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
            return ()=>{};
        }
    };
    
    useEffect(() => {
        return addHandler(shortcuts.font_size_up, () => {
            configs.update.font_size(prev=>{
                const next = prev+1;
                return next > 48 ? prev : next;
            });
        })
    },[
        shortcuts.font_size_up,
    ]);

    useEffect(() => {
        return addHandler(shortcuts.font_size_down, () => {
            configs.update.font_size(prev=>{
                const next = prev-1;
                return next < 6 ? prev : next;
            });
        })
    },[
        shortcuts.font_size_down,
    ]);

    useEffect(() => {
        return addHandler(shortcuts.send_request, () => {
            
        })
    },[
        shortcuts.send_request,
    ]);

    useEffect(() => {
        return addHandler(shortcuts.copy_response, () => {
            
        })
    },[
        shortcuts.copy_response,
    ]);

    return (<></>);
}

export default ShortcutHandler;