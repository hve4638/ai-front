import { useEffect, useState } from 'react';

function useDiff<T>(initialValue:T, callback:((current:T, prev:T)=>T)|undefined=undefined) {
    const [last, setLast] = useState<T>(initialValue);

    return [
        (next:T)=>{
            const prev:T = last;
            setLast(next);

            return callback ? callback(next, prev) : ((next as any) - (prev as any));
        }
    ] as const;
}

export default useDiff;