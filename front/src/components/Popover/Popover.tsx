import React, { forwardRef, useEffect, useRef } from "react";

export type PopoverProps = {
    className?:string;
    style?:React.CSSProperties;
    onClickOutside?:(e:MouseEvent)=>void;
    children?:React.ReactNode;
}

const Popover = forwardRef(
    ({
        className='',
        style={},
        onClickOutside=()=>{},
        children=<></>,
    }:PopoverProps, ref:React.Ref<HTMLInputElement>)=>{
        const contentsRef = useRef<HTMLDivElement>(null);
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
                document.addEventListener('click', handleClick);
            }, 1);
            return () => {
                document.removeEventListener('click', handleClick);
            };
        }, [ref]);

        return (
            <div
                className={className}
                style={style}
                ref={contentsRef}
            >
                {children}
            </div>
        )
    }
)

export default Popover;