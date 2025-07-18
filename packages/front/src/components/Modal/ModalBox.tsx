import React from 'react';
import styles from './style.module.scss';
import { Flex, Row } from 'components/layout';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import classNames from 'classnames';

function ModalBox({
    children,
    className='',
    style={},

    disappear=false,
}: {
    children?: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,

    disappear?: boolean,
}) {
    
    return (
        <div
            className={
                classNames(
                    styles['modal'],
                    className,
                    { [styles['disappear']] : disappear },
                )
            }
            style={{
                borderRadius: '5px',
                ...style,
            }}
        >
            {
                children != null &&
                children
            }
        </div>
    );
}

export default ModalBox;