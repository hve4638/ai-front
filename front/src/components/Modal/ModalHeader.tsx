import classNames from "classnames";
import { GoogleFontIcon } from "components/GoogleFontIcon";
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
            className={classNames('flex', className)}
            style={{
                width: '100%',
            }}
        >
            {
                children != null &&
                <h1
                    className='center undraggable'
                    style={{
                        margin : '4px'
                    }}
                >{children}</h1>
            }
            <Flex/>
            {
                !hideCloseButton &&
                <GoogleFontIcon
                    enableHoverEffect={true}
                    value='close'
                    style={{
                        fontSize: '36px',
                        margin: '4px',
                        cursor: 'pointer',
                    }}
                    onClick={() => onClose()}
                />
            }
        </Row>
    )
}

export default ModalHeader;