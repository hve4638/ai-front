/**
 * 마우스 이동 거리를 주기적으로 측정하여 반환하는 커스텀 훅
 *
 * @param time 마우스 이동 거리를 측정할 간격 (ms)
 * @param enabled 훅 활성화 여부를 결정. 기본값 true
 * @returns [마우스 이동 거리([dx, dy]), 기준점 갱신 함수]
 */
import { useCallback, useEffect, useRef, useState } from 'react';

type Delta = {
    x : number;
    y : number;
}
type Capture = (x?:number, y?:number) => void;

function useMouseDelta(time: number, enabled: boolean = true): [Delta, Capture] {
    const [delta, setDelta] = useState<Delta>({ x: 0, y: 0 });
    const originRef = useRef<{ x: number; y: number }|null>(null);
    const currentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const intervalRef = useRef<number | null>(null);

    const capture = useCallback((x:number=0, y:number=0) => {
        originRef.current = {
            x : currentRef.current.x - x,
            y : currentRef.current.y - y
        };
        setDelta({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        if (!enabled) {
            originRef.current = null;
            setDelta({ x: 0, y: 0 });
            return;
        }

        const handleMouseMove = (event: MouseEvent) => {
            currentRef.current = { x: event.clientX, y: event.clientY };
            if (!originRef.current) {
                originRef.current = { ...currentRef.current };
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        intervalRef.current = window.setInterval(() => {
            if (!originRef.current) return;
            
            const dx = currentRef.current.x - originRef.current.x;
            const dy = currentRef.current.y - originRef.current.y;
            setDelta({ x: dx, y: dy });
        }, time);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        }; 
    }, [time, enabled, capture]);

    return [delta, capture];
}

export default useMouseDelta;