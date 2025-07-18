import { useCallback, useEffect, useRef } from 'react';

/**
 * @param delay 지연시간 (ms)
 * @returns 
 */
function useThrottle<T extends any[]>(
    callback: (...args:T)=>void, delay:number
):(...args:T)=>void {
    const timeoutRef = useRef<number|null>(null);
    const callbackRef = useRef<(...args:T)=>void>(callback);
    const lastArgRef = useRef<T>([] as unknown as T);

    const reserved = useRef<boolean>(false);

    const call = () => {
        callbackRef.current(...lastArgRef.current);
        reserved.current = false;

        timeoutRef.current = window.setTimeout(()=>{
            timeoutRef.current = null;
            lastArgRef.current = [] as unknown as T;

            if (reserved.current) {
                call();
            }
        }, delay);
    }

    useEffect(()=>{
        return () => {
            if (!timeoutRef.current) return;

            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);
    
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    
    const throttle = useCallback((...args: T)=> {
        lastArgRef.current = args;
        if (timeoutRef.current) {
            reserved.current = true;
        }
        else {
            call();
        }
    }, [delay]);

    return throttle;
};

export default useThrottle;