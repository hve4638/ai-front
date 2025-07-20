import { forwardRef } from 'react';
import { useLayoutEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

interface NumberInputProps {
    value? : number|null|undefined;
    onChange: (value:number|null) => void;

    allowEmpty?: boolean;
    allowDecimal?: boolean;
    instantChange?: boolean;
    
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    readOnly?: boolean;
}

const NumberInput = forwardRef(({
    value,
    onChange,
    allowEmpty = false,
    allowDecimal = false,
    instantChange = false,
    
    className='',
    style={},
    placeholder='',
    readOnly = false,
}:NumberInputProps, ref:React.Ref<HTMLInputElement>) => {
    const [current, setCurrent] = useState<string>(value?.toString() ?? '');
    
    useLayoutEffect(() => {
        setCurrent(value?.toString() ?? '');
    }, [value]);

    const changeValue = (value:string) => {
        if (instantChange) commitChange(value);
        else setCurrent(value);
    };

    const commitChange = (value:string) => {
        if (value === '' && allowEmpty) {
            onChange(null);
        }
        else if (allowDecimal) {
            const result = parseFloat(value);
            onChange(isNaN(result) ? 0 : result);
        }
        else {
            const result = parseInt(value);
            onChange(isNaN(result) ? 0 : result);
        }
    }
    return (
        <input
            ref={ref}

            type='number'
            className={classNames(styles['number-input'], className)}
            style={style}

            readOnly={readOnly}
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