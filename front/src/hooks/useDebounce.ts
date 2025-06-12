import { useCallback, useEffect, useRef } from 'react';

function useDebounce<T extends (...args: any[]) => void>(callback: T, delay:number) {
    const timeoutRef = useRef<number|null>(null);
    const callbackRef = useRef<T>(callback);

    useEffect(() => {
        return () => {
            if (timeoutRef.current != null) {
                window.clearTimeout(timeoutRef.current);
           }
        }
    }, []);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    
    const debounce = useCallback((...args: Parameters<T>)=> {
        if (timeoutRef.current != null) {
            window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(()=>{
            callbackRef.current(...args);
            timeoutRef.current = null;
        }, delay);
    }, [delay]);

    return debounce;
};

export default useDebounce;
