import { Flex, Row } from "components/layout";

interface StringFormProps {
    name:string;
    value:string;
    onChange:(x:string)=>void;
}

function StringLongForm({
    name,
    value,
    onChange,
}:StringFormProps) {
  return (
    <div
        style={{
            display: 'block',
            margin: '0.5em 0',
            width : '100%'
            // fontSize: '0.75em'
        }}
    >
        <Row
            style={{
                margin: '0.25em 0',
                paddingLeft : '0.1em',
            }}
        >
            <small className='noflex undraggable'>
                {name}
            </small>
        </Row>
        <Row
            style={{
                height: '1.4em',
                margin: '0.25em 0',
                fontSize: '0.9em',
            }}
        >
            <input
                type='text'
                className='input-number'
                value={value}
                onChange={(e)=>onChange(e.target.value)}
                style={{
                    width : '100%',
                    height: '100%',
                    padding: '1px 6px',
                    boxSizing: 'content-box',
                }}
            />
        </Row>
    </div>
  );
}

export default StringLongForm;