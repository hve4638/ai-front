import React from 'react'

interface CheckboxProps {
    className?:string;
    style?:any;
    name?:string;
    checked:boolean;
    onChange?:(checked:boolean)=>void;
}

export function Checkbox({
    className='',
    style={},
    name='',
    checked,
    onChange=(x)=>{}
}:CheckboxProps) {
    return (
        <div
            className={`${className} checkbox-container undraggable`}
            style={style}
            onClick={(e)=>onChange(!checked)}
        >
            <div
                className={'checkbox center' + (checked ? ' checked' : '')}
            >
                {
                    checked &&
                    <span className="material-symbols-outlined">
                        check
                    </span>
                }
            </div>
            <span className='checkbox-name'>
                {name}
            </span>
        </div>
    );
}

export default Checkbox;