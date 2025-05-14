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
            style={style}
        >
            <input
                type='checkbox'
                
                className={className}
                style={{
                    height: '100%',
                    aspectRatio: '1/1',
                    cursor : 'pointer',
                }}
                checked={checked}
                onChange={(e)=>onChange(e.target.checked)}
            />
        </Center>
    );
}

export default CheckBox;