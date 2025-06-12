import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clamp } from "utils/math";

interface MouseDragProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onDragBegin?: (x:number, y:number) => void;
    onDrag?: (x:number, y:number) => void;
    onDragEnd?: (x:number, y:number) => void;
    onClick?: (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    relative?: boolean;
    clampToBound?: boolean;
}

function MouseDrag({
    className='',
    style={},
    children,
    onDragBegin = (x, y)=>{},
    onDrag = (x, y)=>{},
    onDragEnd = (x, y)=>{},
    onClick = (e) => {},
    relative = true,
    clampToBound = false,
}:MouseDragProps) {
    const dragContainerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);
    const prevPos = useMemo(()=>({ x: 0, y: 0 }), []);

    const getMousePosition = useCallback(
        (e: MouseEvent) => {
            if (!dragContainerRef.current) {
                return { x: 0, y: 0 };
            }
            else if (relative) {
                const rect = dragContainerRef.current.getBoundingClientRect();
                let x = e.clientX;
                let y = e.clientY;
                if (clampToBound) {
                    x = clamp(x, rect.left, rect.right);
                    y = clamp(y, rect.top, rect.bottom);
                }
                
                return {
                    x: x - rect.left,
                    y: y - rect.top,
                };
            }
            else {
                return { x: e.clientX, y: e.clientY };
            }
        },
        [relative, clampToBound]
    );
    
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (dragging) {
                const {x, y} = getMousePosition(e);
                if (prevPos.x !== x || prevPos.y !== y) {
                    prevPos.x = x;
                    prevPos.y = y;
                    onDrag(x, y);
                }
            }
        },
        [dragging, onDrag]
    );
    const handleMouseUp = useCallback(
        (e: MouseEvent) => {
            if (dragging) {
                const {x, y} = getMousePosition(e);
                setDragging(false);
                onDragEnd(x, y)
            }
        },
        [dragging, onDragEnd]
    );

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, handleMouseMove, handleMouseUp]);
    
    return (
        <div
            ref={dragContainerRef}
            className={className}
            style={style}
            onMouseDown={(e)=>{
                if (e.button === 0) {
                    setDragging(true);
    
                    // @TODO : 마우스 문제 해결
                    const {x, y} = getMousePosition(e as unknown as MouseEvent);
                    prevPos.x = x;
                    prevPos.y = y;
                    onDragBegin(x, y);
                }
            }}
            onClick={(e)=>onClick(e)}
        >
            {children ?? <></>}
        </div>
    )
}

export default MouseDrag;