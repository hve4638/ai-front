import { ProfileContext, useContextForce } from "context";
import { useEffect, useMemo } from "react";
import { Shortcut } from "types/shortcut";

function ShortcutHandler() {
    const profileContext = useContextForce(ProfileContext);
    const {
        shortcuts,
        configs,
    } = profileContext;

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
        return addHandler(shortcuts.fontSizeUp, () => {
            console.log('fontSizeUp');
            console.log('size:', configs.fontSize);
            configs.setFontSize(prev=>prev+1);
        })
    },[
        shortcuts.fontSizeUp,
        configs.setFontSize,
    ]);

    useEffect(() => {
        return addHandler(shortcuts.fontSizeDown, () => {
            configs.setFontSize(prev=>prev-1);
        })
    },[
        shortcuts.fontSizeDown,
        configs.setFontSize,
    ]);

    useEffect(() => {
        return addHandler(shortcuts.sendRequest, () => {
            
        })
    },[
        shortcuts.sendRequest,
    ]);

    useEffect(() => {
        return addHandler(shortcuts.copyResponse, () => {
            
        })
    },[
        shortcuts.copyResponse,
    ]);

    return (<></>);
}

export default ShortcutHandler;