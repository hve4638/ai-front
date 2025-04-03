import classNames from 'classnames';
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

function GoogleFontIconButton({
    className='',
    value,
    selected=false,
    enableHoverEffect=false,
    onClick = ()=>{},
    onMouseDown = (e)=>{},
    style = {}
}:GoogleFontIconProps) {
    return (
        <label
            className={classNames('font-button-container undraggable center', className)}
            onClick={(e)=>onClick(e)}
            onMouseDown={(e)=>onMouseDown(e)}
            style={style}
        >
            <span className={classNames('material-symbols-outlined font-button', {selected, 'hover-effect':enableHoverEffect})}>
                {value}
            </span>
        </label>
    )
}

export default GoogleFontIconButton;