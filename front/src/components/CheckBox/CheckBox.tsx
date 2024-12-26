import React from 'react'

interface CheckboxProps {
    className?:string;
    style?:any;
    name?:string;
    checked:boolean;
    onChange?:(checked:boolean)=>void;
}

export function CheckBox({
    className='',
    style={},
    checked,
    onChange=(x)=>{}
}:CheckboxProps) {
    return (
        <label
            className={
                `checkbox-container undraggable`
                + (className ? ` ${className}` : '')
            }
            style={style}
        >
            <div
                className={
                    'checkbox center'
                    + (checked ? ' checked' : '')
                }
                style={{
                    cursor: 'pointer',
                }}
                onClick={(e)=>onChange(!checked)}
            >
                {
                    checked &&
                    <span className="material-symbols-outlined">
                        check
                    </span>
                }
            </div>
        </label>
    );
}

export default CheckBox;