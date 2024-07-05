import { useState, useEffect } from 'react';

const useDebounce = (initialValue, callback, delay = 1000) => {
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

export default useDebounce;
