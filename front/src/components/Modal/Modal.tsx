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
}: {
    disappear?: boolean,
    className?: string,
    style?: React.CSSProperties,
    backgroundClassName?: string,
    backgroundStyle?: React.CSSProperties,
    children?: React.ReactNode,
    onClose?: () => void
}) {
    
    return (
        <div className={
            classNames(
                'modal-background',
                { disappear, backgroundClassName }
            )}
            style={{
                ...backgroundStyle,
            }}
        >
            <div
                className={`modal ${className} ${disappear ? 'disappear' : ''}`}
                style={{
                    ...style,
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