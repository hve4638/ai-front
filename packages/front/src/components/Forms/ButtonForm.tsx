import { Flex, Row } from '@/components/layout';
import { CommonProps } from '@/types';
import Button from '../Button';
import classNames from 'classnames';

interface ButtonFormProps extends CommonProps {
    buttonClassName?: string;
    buttonStyle?: React.CSSProperties;
    name: string;
    text: string;
    onClick: () => void;
}

function ButtonForm({
    buttonClassName = '',
    buttonStyle = {},
    className = '',
    style = {},
    name,
    text,
    onClick,
}: ButtonFormProps) {
    return (
        <Row
            className={classNames(className)}
            style={{
                height: '1.4em',
                margin: '0.5em 0',
                ...style,
            }}
        >
            <span className='noflex undraggable'>
                {name}
            </span>
            <Flex />
            <Button
                className={buttonClassName}
                style={{
                    minWidth: '80px',
                    height: '100%',
                    ...buttonStyle,
                }}
                onClick={() => onClick()}
            >{text}</Button>
        </Row>
    );
}

export default ButtonForm;