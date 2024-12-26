import HoverEffect from 'components/HoverEffect';
import React from 'react';

interface GoogleFontIconProps {
    className?:string;
    enableHoverEffect?:boolean;
    value:string;
    selected?:boolean;
    style?:React.CSSProperties;
    onClick?:(e:React.MouseEvent<HTMLLabelElement, MouseEvent>)=>void;
    onMouseDown?:(e:React.MouseEvent<HTMLLabelElement, MouseEvent>)=>void;
}

function GoogleFontIcon({
    className='',
    enableHoverEffect=false,
    style,
    value,
    onClick = (e)=>{},
    onMouseDown = (e)=>{}
}:GoogleFontIconProps) {
    return (
        <label
            className={
                `relative undraggable center font-icon `
                + (className ? ` ${className}` : '')
                + (enableHoverEffect ? ' hover-effect' : '')
            }
            style={style}
            onClick={(e)=>onClick(e)}
            onMouseDown={(e)=>onMouseDown(e)}
        >
            <span className={`material-symbols-outlined`}>
                {value}
            </span>
        </label>
    )
}

export default GoogleFontIcon;