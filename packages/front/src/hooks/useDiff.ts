import { useEffect, useRef, useState } from 'react';

function useDiff<T>(initialValue: T, callback: ((current: T, prev: T) => T) | undefined = undefined) {
    const lastRef = useRef<T>(initialValue);

    return [
        (next: T) => {
            const prev = lastRef.current;
            lastRef.current = next;

            return callback ? callback(next, prev) : ((next as any) - (prev as any));
        }
    ] as const;
}

export default useDiff;