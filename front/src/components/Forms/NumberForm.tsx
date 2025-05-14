import { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Flex, Row } from '@/components/layout';
import { NumberInput } from '@/components/Input';
import classNames from 'classnames';

interface NumberFormProps {
    name:string;

    value:number;
    onChange:(x:number)=>void;
    allowDecimal?:boolean;
    instantChange?:boolean;
    
    className?: string;
    style?: React.CSSProperties;
    width?:string;
    placeholder?: string;
}

function NumberForm({
    name,
    value,
    onChange,
    allowDecimal = false,
    instantChange = false,

    className = '',
    style = {},
    width,
    placeholder = '',
}:NumberFormProps) {

    return (
        <Row
            style={{
                width: '100%',
                height: '1.4em',
                // margin: '0.5em 0'
            }}
        >
            <span
                className={classNames('noflex undraggable', className)}
            >
                {name}
            </span>
            <Flex/>
            <NumberInput
                style={{
                    ...style,
                    width,
                }}

                onChange={onChange}
                value={value}
                allowDecimal={allowDecimal}
                instantChange={instantChange}
                placeholder={placeholder}
            />
        </Row>
    );
}

export default NumberForm;