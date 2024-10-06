import { useState, useEffect } from 'react';

/**
 * 값이 변경되고 지연 시간 후 콜백 호출, 중간에 값이 변경되면 타이머 리셋
 * @param initialValue 
 * @param callback 
 * @param delay 지연시간 (ms)
 * @returns 
 */
const useDebouncing = (initialValue, callback, delay = 1000) => {
    const [value, setValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timerId);
        };
    }, [value, delay]);

    useEffect(() => {
        callback(debouncedValue);
    }, [debouncedValue]);

    return [value, setValue];
};

export default useDebouncing;
