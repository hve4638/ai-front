import classNames from "classnames";
import { GIconButton, GoogleFontIcon } from "components/GoogleFontIcon";
import { Flex, Row } from "components/layout";

interface ModalHeaderProps {
    className?: string;
    style?: React.CSSProperties;
    onClose?: () => void;
    hideCloseButton?: boolean;
    children?: React.ReactNode;
}

function ModalHeader({
    className,
    onClose = () => {},
    hideCloseButton = false,
    children,
}:ModalHeaderProps) {
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
                        margin : '4px',
                        fontSize: '1.2em',
                        lineHeight: '1',
                    }}
                >{children}</span>
            }
            <Flex/>
            {
                !hideCloseButton &&
                <GIconButton
                    value='close'
                    style={{
                        fontSize: '1.5em',
                        lineHeight: '1',
                    }}
                    hoverEffect='square'
                    onClick={() => onClose()}
                />
            }
        </Row>
    )
}

export default ModalHeader;