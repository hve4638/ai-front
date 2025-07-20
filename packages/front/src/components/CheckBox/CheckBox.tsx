import React from 'react'
import { Center } from '../layout';
import styles from './styles.module.scss';

interface CheckboxProps {
    className?: string;
    style?: any;

    readOnly?: boolean;

    checked: boolean;
    onChange?: (checked: boolean) => void;
}

export function CheckBox({
    className = '',
    style = {},

    readOnly = false,

    checked,
    onChange = (x) => { }
}: CheckboxProps) {
    return (
        <Center
            className={className}
            style={style}
        >
            <input
                type='checkbox'
                className={styles['checkbox']}
                style={{
                    height: '100%',
                    aspectRatio: '1/1',
                    cursor: 'pointer',
                }}
                checked={checked}
                onChange={(e) => {
                    if (!readOnly) {
                        onChange(e.target.checked)
                    }
                }}
                tabIndex={0}
                readOnly={readOnly}
            />
        </Center>
    );
}

export default CheckBox;