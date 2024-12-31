import { Flex, Row } from "components/layout";

interface HotkeyFormProps {
    name:string;
    text:string;
    onClick:()=>void;
}

function HotkeyForm({
    name,
    text,
    onClick,
}:HotkeyFormProps) {
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
            className='form-button undraggable'
            style={{
                minWidth: '35%',
                height: '2em',
                margin: 'auto',
            }}
        >
            {text}
        </button>
    </Row>
  );
}

export default HotkeyForm;