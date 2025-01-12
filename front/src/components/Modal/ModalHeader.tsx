import classNames from "classnames";
import { GoogleFontIcon } from "components/GoogleFontIcon";
import { Flex, Row } from "components/layout";

function ModalHeader({
    title,
    className,
    onClose = () => {},
    hideCloseButton = false,
}: {
    title?: string,
    className?: string,
    style?: React.CSSProperties,
    onClose?: () => void,
    hideCloseButton?: boolean,
}) {
    return (
        <Row
            className={classNames('flex', className)}
            style={{
                width: '100%',
            }}
        >
            {
                title != null &&
                <h1
                    className='center undraggable'
                    style={{
                        margin : '4px'
                    }}
                >{title}</h1>
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