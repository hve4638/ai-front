import React from 'react';
import './style.scss';
import { Flex, Row } from 'components/layout';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import classNames from 'classnames';

function Modal({
    children,
    disappear=false,
    
    className='',
    style={},

    backgroundClassName='',
    backgroundStyle={},

    enableRoundedBackground = false,
}: {
    disappear?: boolean,
    className?: string,
    style?: React.CSSProperties,
    backgroundClassName?: string,
    backgroundStyle?: React.CSSProperties,
    children?: React.ReactNode,
    onClose?: () => void,

    enableRoundedBackground?: boolean
}) {
    
    return (
        <div className={
            classNames(
                'modal-background',
                { disappear, backgroundClassName }
            )}
            style={{
                ...backgroundStyle,
                borderRadius: enableRoundedBackground ? '5px' : '0px',
            }}
        >
            <div
                className={`modal ${className} ${disappear ? 'disappear' : ''}`}
                style={{
                    ...style,
                    borderRadius: '5px',
                }}
            >
                {
                    children != null &&
                    children
                }
            </div>
        </div>
    );
}

export default Modal;