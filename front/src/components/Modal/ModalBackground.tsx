import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

function ModalBackground({
    children,

    className='',
    style={},

    disappear=false,
    enableRoundedBackground = false,
}: {
    children?: React.ReactNode,
    
    className?: string,
    style?: React.CSSProperties,

    disappear?: boolean,
    enableRoundedBackground?: boolean
}) {
    
    return (
        <div className={
            classNames(
                styles['modal-background'],
                { disappear, className }
            )}
            style={{
                ...style,
                borderRadius: enableRoundedBackground ? '5px' : '0px',
            }}
        >
            {
                children != null &&
                children
            }
        </div>
    );
}

export default ModalBackground;