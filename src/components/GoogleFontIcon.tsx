import React from "react";

interface GoogleFontIconProps {
    className?:string;
    value:string;
    selected?:boolean;
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
    className='', value, selected=false, onClick = ()=>{}
}:GoogleFontIconProps) {
    return (
        <label
            className={`font-button-container undraggable center ${className}`}
            onClick={(e)=>onClick()}
        >
            <span className={`material-symbols-outlined font-button${selected ? ' selected' : ''}`}>
                {value}
            </span>
        </label>
    )
}
