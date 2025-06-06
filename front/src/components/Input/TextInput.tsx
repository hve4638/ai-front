import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';


interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
    instantChange?: boolean;

    placeholder?: string;
    warn?: boolean;

    className?: string;
    style?: React.CSSProperties;
}

const TextInput = forwardRef(({
    value,
    onChange,
    instantChange = false,
    warn = false,

    className = '',
    style = {},

    placeholder = '',
}: TextInputProps, ref: React.Ref<HTMLInputElement>) => {
    const composingRef = useRef(false);
    const [current, setCurrent] = useState<string>(value);

    useLayoutEffect(() => {
        setCurrent(value);
    }, [value]);

    const changeValue = (value: string) => {
        setCurrent(value);

        if (instantChange) {
            if (composingRef.current) {
                return;
            }
            onChange(value);
        }
    };
    const commitValue = () => {
        if (current === value) return;
        
        onChange(current);

        if (!instantChange) {
            // 값 반영 후, value가 갱신되지 않으면 이전 값으로 돌아가는 것을 의도함
            setCurrent(value);
        }
    }

    return (
        <input
            type='text'

            className={
                classNames(
                    styles['text-input'],
                    { [styles['warn']]: warn },
                    className,
                )
            }
            style={{
                ...style
            }}
            placeholder={placeholder}

            value={current}
            onChange={(e) => changeValue(e.target.value)}
            onBlur={() => commitValue()}
            onKeyDown={(e) => {
                if (e.key === 'Enter') commitValue();
            }}
            onCompositionStart={() => {
                composingRef.current = true;
            }}
            onCompositionEnd={(e) => {
                composingRef.current = false;
                changeValue(e.currentTarget.value);
            }}
        />
    );
});

export default TextInput;