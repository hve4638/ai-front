import classNames from 'classnames';
import React from 'react';

import styles from './styles.module.scss';

const HoverEffectRadius = {
    None : 'noone',
    Square : 'square',
    Circle : 'circle',
} as const;
type HoverEffectRadius = typeof HoverEffectRadius[keyof typeof HoverEffectRadius];

interface GIconButtonProps {
    className?: string;
    style?: React.CSSProperties;
    value: string;

    hoverEffect?: HoverEffectRadius;

    onClick?: () => void;
    onMouseDown?: (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => void;
}

function IconButton({
    className = '',
    style = {},
    value,
    
    hoverEffect = HoverEffectRadius.None,

    onClick = () => { },
    onMouseDown = (e) => { },
}: GIconButtonProps) {
    let hoverRadius:string|undefined;
    switch(hoverEffect) {
        case HoverEffectRadius.Square:
            hoverRadius = '4px';
            break;
        case HoverEffectRadius.Circle:
            hoverRadius = '21px';
            break;
    }

    return (
        <label
            className={
                classNames(
                    'relative center undraggable',
                    styles['gfonticon-button'],
                    {
                        [styles['hover-effect']]: (hoverRadius != null),
                    },
                    className
                )
            }
            style={{
                borderRadius: hoverRadius,
                ...style,
            }}

            onClick={(e) => onClick()}
            onMouseDown={(e) => onMouseDown(e)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick();
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
        >
            <span
                className={`material-symbols-outlined`}
                style={{ cursor:'pointer'}}
                tabIndex={0}
            >
                {value}
            </span>
        </label>
    )
}

export default IconButton;