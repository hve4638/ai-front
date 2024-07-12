import React from "react";

interface GoogleFontIconProps {
    className?:string;
    value:string;
    size:number;
    enabled?:boolean;
    onClick?:()=>void;
}

export function GoogleFontIcon({
    className='', value, size, enabled=false, onClick = ()=>{}
}:GoogleFontIconProps) {
    const pxsize = `${size}px`;
    return (
        <label
            className={`${className} undraggable center`}
            style={{ color: 'white', fontSize: pxsize, width: pxsize, height: pxsize }}
            onClick={(e)=>onClick()}
        >
            <span className={`${enabled ? 'selected' : ''} material-symbols-outlined`}>
                {value}
            </span>
        </label>
    )
}

export function GoogleFontIconButton({
    className='', value, size, enabled=false, onClick = ()=>{}
}:GoogleFontIconProps) {
    const pxsize = `${size}px`;
    return (
        <label
            className={`undraggable center`}
            style={{ color: 'white', fontSize: pxsize, width: pxsize, height: pxsize }}
            onClick={(e)=>onClick()}
        >
            <span className={`${enabled ? 'selected' : ''} ${className} material-symbols-outlined`}>
                {value}
            </span>
        </label>
    )
}
