import Dropdown from "components/Dropdown";
import type { DropdownItem, DropdownItemList } from "components/Dropdown";
import ToggleSwitch from "components/ToggleSwitch";
import { Flex, Row } from "lib/flex-widget";
import { useState } from "react";

interface DropdownFormProps {
    name:string;
    items:(DropdownItem|DropdownItemList)[];
    value:string;
    onChange:(x:DropdownItem)=>void;
    onItemNotFound?:()=>void;
}

function DropdownForm({
    name,
    items,
    value,
    onChange,
    onItemNotFound = ()=>{},
}:DropdownFormProps) {
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
        <Dropdown
            items={items}
            value={value}
            onChange={onChange}
            onItemNotFound={onItemNotFound}
            style={{
                minWidth: '5em',
                height: '100%',
                fontSize: '0.8em',
            }}
            listStyle={{
                fontSize: '0.8em',
            }}
        />
    </Row>
  );
}

export default DropdownForm;