import React, { ReactNode } from 'react';
import { Column, Flex, Grid, Row } from 'components/layout';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import classNames from 'classnames';
import ModalBackground from './ModalBackground';
import ModalBox from './ModalBox';
import FocusLock from 'react-focus-lock';

interface ModalProps {
    disappear?: boolean,
    className?: string,
    style?: React.CSSProperties,

    headerLabel?: ReactNode,

    backgroundClassName?: string,
    backgroundStyle?: React.CSSProperties,
    children?: React.ReactNode,
    onClose?: () => void,

    enableRoundedBackground?: boolean
}

function Modal({
    children,
    disappear = false,

    headerLabel,

    className = '',
    style = {},

    backgroundClassName = '',
    backgroundStyle = {},

    enableRoundedBackground = false,
}: ModalProps) {
    return (
        <>
            <FocusLock
                autoFocus={false}
                returnFocus={false}
            >
                <ModalBackground
                    className={backgroundClassName}
                    style={backgroundStyle}
                    disappear={disappear}
                    enableRoundedBackground={enableRoundedBackground}
                >
                    <ModalBox
                        className={className}
                        style={{
                            ...style,
                            maxHeight: '100%',
                        }}
                        disappear={disappear}
                    >
                        {
                            headerLabel != null &&
                            <Grid
                                rows='auto 1fr'
                                columns='1fr'
                                style={{
                                    height: '100%',
                                }}
                            >
                                {headerLabel}
                                <div
                                    style={{
                                        display: 'block',
                                        padding: '0.25em 0.25em 0.25em 0.15em',

                                        height: '100%',
                                        overflowX: 'hidden',
                                        overflowY: 'auto',
                                    }}
                                >
                                    {
                                        children != null &&
                                        children
                                    }
                                </div>
                            </Grid>
                        }
                        {
                            headerLabel == null &&
                            <Grid
                                rows='1fr'
                                columns='1fr'
                                style={{
                                    height: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'block',
                                        padding: '0.25em 0.25em 0.25em 0.15em',

                                        height: '100%',
                                        overflowX: 'hidden',
                                        overflowY: 'auto',
                                    }}
                                >
                                    {
                                        children != null &&
                                        children
                                    }
                                </div>
                            </Grid>
                        }
                    </ModalBox>
                </ModalBackground>
            </FocusLock>
        </>
    );
}

export default Modal;