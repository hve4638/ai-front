import { Flex, Row } from "components/layout";
import { TextInput } from "../Input";

interface StringFormProps {
    name:string;
    value:string;
    onChange:(x:string)=>void;
    instantChange?:boolean;
    placeholder?:string;
}

function StringLongForm({
    name,
    value,
    onChange,
    instantChange=false,
    placeholder='',
}:StringFormProps) {
  return (
    <div
        style={{
            display: 'block',
            width : '100%'
        }}
    >
        <Row
            style={{
                margin: '0.25em 0',
                paddingLeft : '0.1em',
            }}
        >
            <span className='noflex undraggable'>
                {name}
            </span>
        </Row>
        <Row
            style={{
                height: '1.4em',
                margin: '0.25em 0',
                fontSize: '0.9em',
            }}
        >
            <TextInput
                value={value}
                onChange={(x)=>onChange(x)}
                placeholder={placeholder}
                instantChange={instantChange}

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