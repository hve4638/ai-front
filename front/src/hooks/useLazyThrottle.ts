import { useCallback, useEffect, useRef } from 'react';

/**
 * @param delay 지연시간 (ms)
 * @returns 
 */
function useLazyThrottle<T extends any[]>(
    callback: (...args:T)=>void, delay:number
):(...args:T)=>void {
    const timeoutRef = useRef<number|null>(null);
    const callbackRef = useRef<(...args:T)=>void>(callback);
    const lastArgRef = useRef<T>([] as unknown as T);
    
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    
    const throttle = useCallback((...args: T)=> {
        lastArgRef.current = args;
        if (timeoutRef.current == null) {
            timeoutRef.current = window.setTimeout(()=>{
                callbackRef.current(...lastArgRef.current);
                timeoutRef.current = null;
                lastArgRef.current = [] as unknown as T;
            }, delay);
        }
    }, [delay]);

    return throttle;
};

export default useLazyThrottle;
