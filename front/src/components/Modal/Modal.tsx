import React from 'react';
import './style.scss';
import { Flex, Row } from 'lib/flex-widget';
import { GoogleFontIcon } from 'components/GoogleFontIcon';

function Modal({
    children,
    disappear=false,
    className='',
    style={},
}: {
    title?: string,
    disappear?: boolean,
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode,
    onClose?: () => void
}) {
    return (
        <div className={`modal-background ${disappear ? 'disappear' : ''}`}>
            <div
                className={`modal ${className} ${disappear ? 'disappear' : ''}`}
                style={{
                    ...style
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