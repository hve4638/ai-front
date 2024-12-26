import { useCallback, useEffect, useRef } from 'react';

/**
 * @param delay 지연시간 (ms)
 * @returns 
 */
function useThrottle<T extends (...args: any[]) => void>(callback: T, delay:number) {
    const timeoutRef = useRef<number|null>(null);
    const callbackRef = useRef<T>(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    
    const throttle = useCallback((...args: Parameters<T>)=> {
        if (timeoutRef.current == null) {
            timeoutRef.current = window.setTimeout(()=>{
                callbackRef.current(...args);
                timeoutRef.current = null;
            }, delay);
        }
    }, [delay]);

    return throttle;
};

export default useThrottle;
