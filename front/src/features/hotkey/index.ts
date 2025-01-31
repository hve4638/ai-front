type HotkeyCallbacks = {
    [key:string]:(e:KeyboardEvent)=>boolean|void;
}

/**
 * 
 * @param callbacks 리턴 값이 true이면 preventDefault, stopPropagation을 호출함
 * @returns 
 */
export function hotkey(callbacks:HotkeyCallbacks) {
    const lowerCallbacks:HotkeyCallbacks = {}
    for (const key in callbacks) {
        lowerCallbacks[key.toLowerCase()] = callbacks[key];
    }

    const listener = (e:KeyboardEvent)=>{
        const key = e.key.toLowerCase();
        const callback = lowerCallbacks[key];
        if (callback != null) {
            if (callback(e)) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }
    
    window.addEventListener('keydown', listener);

    return ()=>window.removeEventListener('keydown', listener);
}