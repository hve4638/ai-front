import useHotkey from "@/hooks/useHotkey";
import React, { forwardRef, MouseEventHandler, useEffect, useRef } from "react";
import FocusLock from 'react-focus-lock';

export type PopoverProps = {
    className?:string;
    style?:React.CSSProperties;
    onClickOutside?:(e:MouseEvent)=>void;
    onMouseDown?:MouseEventHandler<HTMLDivElement>;
    children?:React.ReactNode;
}

const Popover = forwardRef(
    (props:PopoverProps, ref:React.Ref<HTMLInputElement>)=>{
        const {
            className='',
            style={},
            onClickOutside=()=>{},
            children=<></>,
        } = props;
        const contentsRef = useRef<HTMLDivElement>(null);

        useHotkey(
            {
                'Escape': (e:KeyboardEvent) => {
                    onClickOutside(e as unknown as MouseEvent);
                    return true;
                },
            }
        )

        useEffect(()=>{
            const handleClick = (e:MouseEvent) => {
                if (
                    contentsRef.current &&
                    !contentsRef.current.contains(e.target as Node)
                ) {
                    onClickOutside(e);
                }
            }
            
            setTimeout(()=>{
                document.addEventListener('mousedown', handleClick);
            }, 1);
            return () => {
                document.removeEventListener('mousedown', handleClick);
            };
        }, [ref]);

        return (
            <FocusLock
                returnFocus={true}
            >
                <div
                    className={className}
                    style={style}
                    ref={contentsRef}
                    onMouseDown={props.onMouseDown}
                >
                    {children}
                </div>
            </FocusLock>
        )
    }
)

export default Popover;