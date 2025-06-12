import { DependencyList, useEffect, useMemo } from 'react';

type HotkeyCallbacks = {
    [key:string]:(e:KeyboardEvent)=>boolean|void;
}

/**
 * hotkey 지정 후크
 * 
 * @param hotkey Record<string, hook> 형식, hook 반환값이 true라면 stopPropagation 및 preventDefault 호출됨
 * @param enabled {boolean} false 일 경우 hotkey가 비활성화 됨
 * @param deps 값 제공 시, deps가 변경될 때마다 hotkey가 재설정됨
 */
function useHotkey(hotkey:HotkeyCallbacks, enabled:boolean=true, deps?:DependencyList) {
    const callbacks = useMemo(()=>{
        const lowerCallbacks:HotkeyCallbacks = {}
        for (const key in hotkey) {
            lowerCallbacks[key.toLowerCase()] = hotkey[key];
        }
        return lowerCallbacks;
    }, [hotkey]);

    let dependencyList:DependencyList|undefined = undefined;
    if (deps) {
        dependencyList = [...deps, enabled];
    }
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
    }, dependencyList);
}

export default useHotkey;