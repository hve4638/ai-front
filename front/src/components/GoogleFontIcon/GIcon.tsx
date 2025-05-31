import classNames from 'classnames';
import React from 'react';

import styles from './styles.module.scss';

interface GIconButtonProps {
    className?: string;
    style?: React.CSSProperties;
    value: string;

    onClick?: (e: React.MouseEvent<HTMLLabelElement, MouseEvent>|React.KeyboardEvent<HTMLLabelElement>) => void;
    onMouseDown?: (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => void;
}

function GIcon({
    className = '',
    style = {},
    value,

    onClick = (e) => {},
    onMouseDown = (e) => {},
}: GIconButtonProps) {

    return (
        <label
            className={
                classNames(
                    'relative center undraggable',
                    className
                )
            }
            style={{
                ...style,
            }}

            onClick={(e) => onClick(e)}
            onMouseDown={(e) => onMouseDown(e)}
        >
            <span
                className={`material-symbols-outlined`}
            >
                {value}
            </span>
        </label>
    )
}

export default GIcon;