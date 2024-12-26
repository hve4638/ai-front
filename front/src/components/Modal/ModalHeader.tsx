import { GoogleFontIcon } from "components/GoogleFontIcon";
import { Flex, Row } from "lib/flex-widget";

function ModalHeader({
    title,
    onClose = () => {}
}: {
    title?: string,
    className?: string,
    style?: React.CSSProperties,
    onClose?: () => void
}) {
    return (
        <Row
            className='flex'
            style={{
                width: '100%',
            }}
        >
            {
                title != null &&
                <h2
                    className='center undraggable'
                    style={{
                        margin : '4px'
                    }}
                >{title}</h2>
            }
            <Flex/>
            <GoogleFontIcon
                value='close'
                style={{
                    fontSize: '36px',
                    margin: '4px',
                    cursor: 'pointer',
                }}
                onClick={() => onClose()}
            />
        </Row>
    )
}

export default ModalHeader;