import React from 'react';

interface GoogleFontIconProps {
    className?:string;
    showHoverEffect?:boolean;
    value:string;
    selected?:boolean;
    style?:React.CSSProperties;
    onClick?:(e:React.MouseEvent<HTMLLabelElement, MouseEvent>)=>void;
    onMouseDown?:(e:React.MouseEvent<HTMLLabelElement, MouseEvent>)=>void;
}

function GoogleFontIconButton({
    className='', value, selected=false, onClick = ()=>{}, onMouseDown = (e)=>{},
    style = {}
}:GoogleFontIconProps) {
    return (
        <label
            className={`font-button-container undraggable center ${className}`}
            onClick={(e)=>onClick(e)}
            onMouseDown={(e)=>onMouseDown(e)}
            style={style}
        >
            <span className={`material-symbols-outlined font-button${selected ? ' selected' : ''}`}>
                {value}
            </span>
        </label>
    )
}

export default GoogleFontIconButton;