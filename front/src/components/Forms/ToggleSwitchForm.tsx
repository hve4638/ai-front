import ToggleSwitch from "components/ToggleSwitch";
import { Flex, Row } from "lib/flex-widget";
import { useState } from "react";

interface ToggleSwitchFormProps {
    name:string;
    enabled:boolean;
    onChange:(x:boolean)=>void;
}

function ToggleSwitchForm({
    name,
    enabled,
    onChange
}:ToggleSwitchFormProps) {
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
        <ToggleSwitch
            style={{
                width: '2.45em',
                height: '1.4em',
                margin: 'auto',
            }}
            enabled={enabled}
            onChange={onChange}
        />
    </Row>
  );
}

export default ToggleSwitchForm;