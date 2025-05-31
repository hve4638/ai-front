import { DependencyList, useMemo, useRef } from 'react';

function useCache<T>(
    factory: () => T,
    deps: DependencyList,
    max_cache: number = 10,
): T {
    const cacheRef = useRef<[DependencyList, T][]>([]);

    const getCurrent: () => [T, number | null] = () => {
        const cache = cacheRef.current;

        const cacheIndex = cache.findIndex(([d, v])=>isDepsEqual(d, deps));
        if (cacheIndex !== -1) {
            return [cache[cacheIndex][1], cacheIndex];
        }
        else {
            return [factory(), null];
        }
    }

    const isDepsEqual = (a: DependencyList, b: DependencyList): boolean => {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!Object.is(a[i], b[i])) return false;
        }
        return true;
    }

    return useMemo(() => {
        const [last, cacheIndex] = getCurrent();

        const cache = cacheRef.current;
        if (cacheIndex === null) {
            cache.push([[...deps], last]);

            if (cache.length > max_cache) {
                cache.shift();
            }
        }
        else if (cacheIndex !== cache.length - 1) {
            const lastUsed = cache.splice(cacheIndex, 1)[0];
            cache.push(lastUsed);
        }
        return last;
    }, deps);
}

export default useCache;