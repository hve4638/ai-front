import classNames from "classnames";
import { Flex, Row } from "components/layout";

interface StringFormProps {
    name:string;
    width?:string;
    value:string;
    onChange:(x:string)=>void;
    warning?:string;

    className?:string;
}

function StringForm({
    className='',
    name,
    width,
    value,
    onChange,
}:StringFormProps) {
  return (
    <Row
        className={classNames('string-form', className)}
        style={{
            height: '1.4em',
            margin: '0.5em 0'
        }}
    >
        <span className='noflex undraggable'>
            {name}
        </span>
        <Flex/>
        <input
            className='input-number'
            type='text'
            value={value}
            style={{
                width
            }}
            onChange={(e)=>onChange(e.target.value)}
        />
    </Row>
  );
}

export default StringForm;