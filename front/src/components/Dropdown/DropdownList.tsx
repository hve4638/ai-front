import { GoogleFontIcon } from "components/GoogleFontIcon";
import React, { useEffect, useState, useRef, useMemo, useLayoutEffect, forwardRef } from "react";

interface DropdownListProps {
    className?:string;
    style?: React.CSSProperties;
    parentRef: React.RefObject<HTMLDivElement>;
    reposition?:(rect:DOMRect)=>{left:number, top:number, width:number};

    children?: React.ReactNode;
}

const DropdownList = forwardRef(({
    className='',
    style={},
    reposition=({left, top, width}:DOMRect)=>({left, top, width}),
    parentRef,
    children,
}: DropdownListProps, ref:React.LegacyRef<HTMLDivElement>) => {
    
    const {
        left,
        top,
        width,
    } = useMemo(()=>{
        if (parentRef.current) {
            const rect = parentRef.current.getBoundingClientRect();
            return reposition(rect);
        }
        return {
            left: 0,
            top: 0,
            width: 0,
        }
    }, [parentRef.current, reposition]);

    return (
        <div
            ref={ref}
            className={`dropdown-list ${className} `}
            style={{
                left: left,
                top: top,
                minWidth: width,
                ...style,
            }}
        >
            {
                children != null &&
                children
            }
        </div>
    );
});

export default DropdownList;