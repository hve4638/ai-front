import { Flex, Row } from "lib/flex-widget";

interface StringFormProps {
    name:string;
    value:string;
    onChange:(x:string)=>void;
}

function StringForm({
    name,
    value,
    onChange,
}:StringFormProps) {
  return (
    <Row
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
            type='text'
            className='input-number'
            value={value}
            onChange={(e)=>onChange(e.target.value)}
        />
    </Row>
  );
}

export default StringForm;