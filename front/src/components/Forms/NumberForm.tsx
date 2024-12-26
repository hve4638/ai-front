import { Flex, Row } from "lib/flex-widget";

interface NumberFormProps {
    name:string;
    width?:string;
    value:number;
    onChange:(x:number)=>void;
}

function NumberForm({
    name,
    width,
    value,
    onChange,
}:NumberFormProps) {
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
            className='input-number'
            type='number'
            value={value}
            style={{
                width
            }}
            onChange={(e)=>{
                onChange(parseInt(e.target.value))
            }}
        />
    </Row>
  );
}

export default NumberForm;