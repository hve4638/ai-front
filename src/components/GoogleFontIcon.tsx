import React from "react";

interface GoogleFontIconProps {
    className?:string;
    value:string;
    selected?:boolean;
    onClick?:()=>void;
}

export function GoogleFontIcon({
    className='', value, onClick = ()=>{}
}:GoogleFontIconProps) {
    return (
        <label
            className={`${className} undraggable center`}
            style={{ color: 'white' }}
            onClick={(e)=>onClick()}
        >
            <span className={`material-symbols-outlined`}>
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
