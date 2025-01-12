import React from 'react';
import { Flex, Row } from 'components/layout';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import classNames from 'classnames';
import ModalBackground from './ModalBackground';
import ModalBox from './ModalBox';

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
    <>
        <ModalBackground
            className={backgroundClassName}
            style={backgroundStyle}
            disappear={disappear}
            enableRoundedBackground={enableRoundedBackground}
        >
            <ModalBox
                className={className}
                style={style}
                disappear={disappear}
            >
                {
                    children != null &&
                    children
                }
            </ModalBox>
        </ModalBackground>
    </>
    );
}

export default Modal;