import CheckBox from "components/CheckBox";
import { Center, Flex, Row } from "components/layout";

interface CheckBoxFormProps {
    name:string;
    checked:boolean;
    onChange?:(checked:boolean)=>void;

    className?:string;
    style?:React.CSSProperties;
}

function CheckBoxForm({
    name,
    checked,
    onChange=(x)=>{},

    className='',
    style={},
}:CheckBoxFormProps) {
  return (
    <Row
        className={className}
        style={{
            height: '1.4em',
            margin: '0.5em 0',
            ...style
        }}
    >
        <span className='noflex undraggable'>
            {name}
        </span>
        <Flex/>
        <Center
            style={{
                height: '100%',
                padding: '0.2em',
            }}
        >
            <input
                type='checkbox'
                style={{
                    height: '100%',
                    aspectRatio: '1/1',
                }}
                checked={checked}
                onChange={(e)=>onChange(e.target.checked)}
                tabIndex={0}
            />
        </Center>
    </Row>
  );
}

export default CheckBoxForm;