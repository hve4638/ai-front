import { Flex, Row } from "components/layout";
import { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from "react";

interface NumberFormProps {
    name:string;
    width?:string;
    value:number;
    lazy?:boolean;
    onChange:(x:number)=>void;
    allowDecimal?:boolean;
}

function NumberForm({
    name,
    width,
    value,
    onChange,
    lazy=false,
    allowDecimal=false
}:NumberFormProps) {
    const [current, setCurrent] = useState<string>(value.toString());
    useLayoutEffect(()=>{
        setCurrent(value.toString());
    }, [value]);

    const commitChange = (value:string) => {
        if (allowDecimal) {
            onChange(parseFloat(value))
        }
        else {
            onChange(parseInt(value))
        }
    }

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
                value={current}
                style={{
                    width
                }}
                onChange={(e)=>{
                    setCurrent(e.target.value);
                }}
                onBlur={()=>{
                    commitChange(current);
                }}
                onKeyDown={(e)=>{
                    if (e.key === 'Enter') commitChange(current);
                }}
            />
        </Row>
    );
}

export default NumberForm;