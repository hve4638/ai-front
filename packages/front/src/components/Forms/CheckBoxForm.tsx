import { ReactNode } from 'react';
import { Center, Flex, Row } from 'components/layout';
import classNames from 'classnames';
import CheckBox from '../CheckBox';

interface CheckBoxFormProps {
    name?: string;
    label?: string | ReactNode;

    checked: boolean;
    onChange?: (checked: boolean) => void;

    className?: string;
    style?: React.CSSProperties;

    disabled?: boolean;
}

function CheckBoxForm({
    name,
    label,
    checked,
    onChange = (x) => { },

    className = '',
    style = {},

    disabled = false,
}: CheckBoxFormProps) {
    return (
        <Row
            className={classNames(className, {
                'dimmed-color': disabled,
            })}
            style={{
                width: '100%',
                height: '1.4em',
                ...style
            }}
        >
            <span className='noflex undraggable'>
                {label ?? name}
            </span>
            <Flex />
            <CheckBox
                style={{
                    height: '100%',
                    padding: '0.2em',
                }}
                checked={checked}
                onChange={onChange}
                readOnly={disabled}
            />
        </Row>
    );
}

export default CheckBoxForm;