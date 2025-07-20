import { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Flex, Row } from '@/components/layout';
import { NumberInput } from '@/components/Input';
import classNames from 'classnames';

interface NumberFormProps {
    name:string;

    value:number|null|undefined;
    onChange:(x:number|null)=>void;
    
    disabled?:boolean;
    allowEmpty?:boolean;
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

    disabled = false,
    allowEmpty = false,
    allowDecimal = false,
    instantChange = false,

    className = '',
    style = {},
    width,
    placeholder = '',
}:NumberFormProps) {
    return (
        <Row
            className={classNames({
                'dimmed-color': disabled,
            })}
            style={{
                width: '100%',
                height: '1.4em',
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

                allowEmpty={allowEmpty}
                allowDecimal={allowDecimal}
                instantChange={instantChange}

                placeholder={placeholder}
                readOnly={disabled}
            />
        </Row>
    );
}

export default NumberForm;