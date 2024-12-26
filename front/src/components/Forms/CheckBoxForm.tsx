import CheckBox from "components/CheckBox";
import { Flex, Row } from "lib/flex-widget";

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
        <CheckBox
            style={{
                height: '100%',
            }}
            checked={checked}
            onChange={onChange}
        />
    </Row>
  );
}

export default CheckBoxForm;