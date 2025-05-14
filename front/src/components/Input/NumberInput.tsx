import { forwardRef } from 'react';
import { useLayoutEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

interface NumberInputProps {
    value : number;
    onChange: (value:number) => void;
    allowDecimal?: boolean;
    instantChange?: boolean;
    
    
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
}

const NumberInput = forwardRef(({
    value,
    onChange,
    allowDecimal = false,
    instantChange = false,
    
    className='',
    style={},
    placeholder='',
}:NumberInputProps, ref:React.Ref<HTMLInputElement>) => {
    const [current, setCurrent] = useState<string>(value.toString());
    
    useLayoutEffect(() => {
        setCurrent(value.toString());
    }, [value]);

    const changeValue = (value:string) => {
        if (instantChange) commitChange(value);
        else setCurrent(value);
    };

    const commitChange = (value:string) => {
        if (allowDecimal) {
            onChange(parseFloat(value))
        }
        else {
            onChange(parseInt(value))
        }
    }
    return (
        <input
            ref={ref}

            type='number'
            className={classNames(styles['number-input'], className)}
            style={style}

            placeholder={placeholder}
            value={current}
            onChange={(e)=>changeValue(e.target.value)}

            onBlur={()=>commitChange(current)}
            onKeyDown={(e)=>{
                if (e.key === 'Enter') commitChange(current);
            }}
        />
    );
})

export default NumberInput;