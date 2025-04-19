import React from 'react'
import { Center } from '../layout';

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
        <Center
            
            // className={
            //     `checkbox-container undraggable`
            //     + (className ? ` ${className}` : '')
            // }
            style={style}
        >
            <input
                type='checkbox'
                style={{
                    height: '100%',
                    aspectRatio: '1/1',
                }}
                checked={checked}
                onChange={(e)=>onChange(e.target.checked)}
            />
            {/* <div
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
            </div> */}
        </Center>
    );
}

export default CheckBox;