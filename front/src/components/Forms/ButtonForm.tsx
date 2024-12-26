import { Flex, Row } from "lib/flex-widget";

interface ButtonFormProps {
    name:string;
    text:string;
    onClick:()=>void;
}

function ButtonForm({
    name,
    text,
    onClick,
}:ButtonFormProps) {
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
        <button
            className='form-button'
        >
            {text}
        </button>
    </Row>
  );
}

export default ButtonForm;