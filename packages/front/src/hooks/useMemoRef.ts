import { DependencyList, useMemo } from 'react';

function useMemoRef<T=any>(factory:()=>T, deps: DependencyList): { current: T } {
    return useMemo(() => ({ current: factory() }), deps);
}

export default useMemoRef;