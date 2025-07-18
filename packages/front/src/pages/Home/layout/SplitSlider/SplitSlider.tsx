import classNames from 'classnames';

import { Center } from '@/components/layout';
import styles from './styles.module.scss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConfigStore } from '@/stores';
import { GoogleFontIcon } from '@/components/GoogleFontIcon';

import useMouseDelta from '@/hooks/useMouseDelta';

type SplitSliderProps = {
    containerRef: React.RefObject<HTMLDivElement>;
}

function SplitSlider({ containerRef }:SplitSliderProps) {
    const [left, right] = useConfigStore(state=>state.textarea_io_ratio);
    const getRect = useCallback(()=>{
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();

            return {
                width : rect.width,
                height : rect.height,
            }
        }
        else {
            return {
                width : 0,
                height : 0,
            }
        }
    }, [containerRef]);
    
    const layoutMode = useConfigStore(state=>state.layout_mode);
    const localUpdateConfigStore = useConfigStore(state=>state.localUpdate);
    const commitConfigStore = useConfigStore(state=>state.commit);
    
    const [altMode, setAltMode] = useState(false);
    const [splitMode, setSplitMode] = useState(false);

    const rate = (100 * left) / (left + right);

    const [mouseDelta, capture] = useMouseDelta(4, splitMode);
    const HorizontalPosition = useMemo(()=>{
        return layoutMode === 'horizontal' ? `${rate}%` : '50%';
    }, [rate, layoutMode]);
    const verticalPosition = useMemo(()=>{
        return layoutMode === 'vertical' ? `${rate}%` : '50%';
    }, [rate, layoutMode]);

    useEffect(()=>{
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Alt') setAltMode(true);
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Alt') setAltMode(false);
        };
        const handleMouseUp = () => {
            setSplitMode(prev=>{
                if (prev) {
                    commitConfigStore.textarea_io_ratio();
                }
                return false;
            });
            
        }
        const handleBlur = () => {
            setAltMode(false);
            setSplitMode(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(()=>{
        if (!splitMode) return;
        let nextLeft:number, nextRight:number;
        const isHorizontal = layoutMode === 'horizontal';

        if (isHorizontal) {
            if (mouseDelta.x === 0) return;

            const width = getRect().width;
            const current = width * rate / 100;

            nextLeft = current + mouseDelta.x;
            nextRight = width - nextLeft;
        }
        else {
            if (mouseDelta.y === 0) return;

            const height = getRect().height;
            const current = height * rate / 100;

            nextLeft = current + mouseDelta.y;
            nextRight = height - nextLeft;
        }

        // 2:8 비율 초과 시 반영하지 않음
        // 초과한 마우스 이동거리는 mouseDelta에 유지해서 반대 방향 슬라이드 시 자연스럽게 작동하도록 함
        const total = nextLeft + nextRight;
        const nextLeftRate = 10 * nextLeft;
        if (nextLeftRate < 2 * total) {
            const exceeded = (nextLeftRate - (2 * total)) / 10

            if (isHorizontal) capture(exceeded, 0);
            else capture(0, exceeded);
            localUpdateConfigStore.textarea_io_ratio([2, 8]);
        }
        else if (nextLeftRate > 8 * total) {
            const exceeded = (nextLeftRate - (8 * total)) / 10;
            
            if (isHorizontal) capture(exceeded, 0);
            else capture(0, exceeded);
            localUpdateConfigStore.textarea_io_ratio([8, 2]);
        }
        else {
            capture();
            localUpdateConfigStore.textarea_io_ratio([nextLeft, nextRight]);
        }
    }, [mouseDelta]);

    return (
        <Center
            className={classNames(
                styles['splitter-handle'],
                {
                    [styles['show']] : altMode || splitMode,
                    [styles['enabled']] : splitMode,
                },
            )}
            style={{
                left : HorizontalPosition,
                top : verticalPosition,
                zIndex: 1,
            }}
            onMouseDown={()=>{
                setSplitMode(true);
            }}
        >
            <GoogleFontIcon value='menu'/>
        </Center>
    )
}

export default SplitSlider;