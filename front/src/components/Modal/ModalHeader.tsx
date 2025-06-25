import classNames from "classnames";
import { GIconButton, GoogleFontIcon } from "components/GoogleFontIcon";
import { Flex, Row } from "components/layout";
import { useMemo } from "react";

interface ModalHeaderProps {
    className?: string;
    style?: React.CSSProperties;
    onClose?: () => void;
    buttonRenderer?: () => React.ReactNode;
    hideCloseButton?: boolean;
    children?: React.ReactNode;
}

function ModalHeader({
    className,
    onClose = () => { },
    hideCloseButton = false,
    buttonRenderer,
    children,
}: ModalHeaderProps) {
    const button = useMemo(() => {
        if (buttonRenderer) {
            return buttonRenderer();
        }
        else if (!hideCloseButton) {
            return <GIconButton
                value='close'
                hoverEffect='square'
                onClick={() => onClose()}
            />
        }
        else {
            return <></>
        }
    }, [buttonRenderer, hideCloseButton])

    return (
        <Row
            className={className}
            style={{
                width: '100%',
                height: '1.5em',
                marginBottom: '8px',
            }}
        >
            {
                children != null &&
                <span
                    className='center undraggable'
                    style={{
                        margin: '4px',
                        fontSize: '1.2em',
                        lineHeight: '1',
                    }}
                >{children}</span>
            }
            <Flex />
            <div
                style={{
                    fontSize: '1.5em',
                    lineHeight: '1',
                }}
            >
            {button}

            </div>
        </Row>
    )
}

export default ModalHeader;