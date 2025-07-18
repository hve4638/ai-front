import { useState } from "react";

function useSignal() {
    const [ping, setPing] = useState<number>(0);

    return [
        ping,
        ()=>setPing(prev=>prev+1)
    ] as const;
}

export default useSignal;