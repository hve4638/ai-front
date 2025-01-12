import { Flex, Row } from "components/layout";
import { useEffect } from "react";

interface NumberFormProps {
    name:string;
    width?:string;
    value:number;
    onChange:(x:number)=>void;
    allowDecimal?:boolean;
}

function NumberForm({
    name,
    width,
    value,
    onChange,
    allowDecimal=false
}:NumberFormProps) {
    useEffect(()=>{
        
    }, [allowDecimal]);

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
                    if (allowDecimal) {
                        onChange(parseFloat(e.target.value))
                    }
                    else {
                        onChange(parseInt(e.target.value))
                    }
                }}
            />
        </Row>
    );
}

export default NumberForm;