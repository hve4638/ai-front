import { forwardRef, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';


interface TextAreaInputProps {
    value : string;
    onChange: (value:string) => void;
    instantChange?: boolean;

    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
}

const TextAreaInput = forwardRef(({
    value,
    onChange,
    instantChange = false,
    
    className='',
    style={},

    placeholder='',
}:TextAreaInputProps, ref:React.Ref<HTMLTextAreaElement>)=>{
    const [current, setCurrent] = useState<string>(value);

    useLayoutEffect(() => {
        setCurrent(value);
    }, [value]);

    const changeValue = (value:string) => {
        if (instantChange) onChange(value);
        else setCurrent(value);
    };
    const commitValue = () => {
        onChange(current);
    }

    return (
        <textarea
            ref={ref}
            
            className={classNames(styles['textarea-input'])}
            style={style}
            placeholder={placeholder}

            value={current}
            onChange={(e)=>changeValue(e.target.value)}
            onBlur={()=>commitValue()}
            onKeyDown={(e)=>{
                if (e.key === 'Enter') commitValue();
            }}
        />
    )
});

export default TextAreaInput;