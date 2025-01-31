import { DependencyList, useEffect, useMemo } from "react";

type HotkeyCallbacks = {
    [key:string]:(e:KeyboardEvent)=>boolean|void;
}
function useHotkey(hotkey:HotkeyCallbacks, enabled:boolean=true, deps:DependencyList=[]) {
    const callbacks = useMemo(()=>{
        const lowerCallbacks:HotkeyCallbacks = {}
        for (const key in hotkey) {
            lowerCallbacks[key.toLowerCase()] = hotkey[key];
        }
        return lowerCallbacks;
    }, [hotkey]);

    useEffect(()=>{
        const listener = (e:KeyboardEvent)=>{
            const key = e.key.toLowerCase();
            const callback = callbacks[key];
            if (callback != null) {
                if (callback(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }

        if (enabled) {
            window.addEventListener('keydown', listener);
    
            return ()=>window.removeEventListener('keydown', listener);
        }
    }, [enabled, ...deps]);
}

export default useHotkey;