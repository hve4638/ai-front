import classNames from "classnames";
import { forwardRef } from "react";
import styles from './styles.module.scss';


interface TextInputProps {
    className?: string;
    style?: React.CSSProperties;

    placeholder?: string;
    value : string;
    onChange: (value:string) => void;
}

const TextInput = forwardRef(({
    className='',
    style={},

    placeholder='',
    value,
    onChange
}:TextInputProps, ref:React.Ref<HTMLInputElement>)=>{
    return (
        <input
            ref={ref}
            className={classNames(styles['text-input'], className)}
            type='text'
            placeholder={placeholder}
            style={{
                ...style
            }}
            value={value}
            onChange={(e)=>onChange(e.target.value)}
        />
    )
});

export default TextInput;