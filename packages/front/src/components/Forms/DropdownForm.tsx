import Dropdown from '@/components/Dropdown';
import type { DropdownItem, DropdownItemList } from '@/components/Dropdown';
import { Align, Flex, Row } from '@/components/layout';

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
            width: '100%',
            height: '1.4em',
            lineHeight: '1',
        }}
        columnAlign={Align.Center}
    >
        <span
            className='noflex undraggable'
        >
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