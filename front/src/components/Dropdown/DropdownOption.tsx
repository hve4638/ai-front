import { useEffect, useMemo, useRef, useState } from 'react';
import type { DropdownItem, DropdownItemList } from './types';

interface DropdownItemProps {
    className?:string;
    style?: React.CSSProperties;
    item:DropdownItem|DropdownItemList

    onClick?: () => void;
    onHover?: () => void;
    onHoverLeave?: () => void;
    onFocus?: (rect:DOMRect|undefined) => void;

    renderItem?: (item: DropdownItem|DropdownItemList) => React.ReactNode;
}

function DropdownOption({
    className='',
    style={},
    item,
    onFocus = (rect)=>{},
    onClick = ()=>{},
    renderItem = (item)=>item.name,
}:DropdownItemProps) { 
    const optionRef:React.LegacyRef<HTMLDivElement> = useRef(null);
    const [hover, setHover] = useState(false);
    const name = useMemo(()=>renderItem(item), [item]);

    useEffect(()=>{
        let to:number;
        if (hover) {
            to = window.setTimeout(()=>{
                const rect = optionRef.current?.getBoundingClientRect();
                
                onFocus(rect);
            }, 45);
        }

        return ()=>{
            window.clearTimeout(to);
        }
    }, [hover]);

    return (
        <div
            ref = {optionRef}
            className={
                'dropdown-item'
                + ('list' in item ? ' dropdown-array' : '')
                + (className ? ' ' + className : '')
            }
            style={style}
            onMouseEnter={(e) => {
                setHover(true);
            }}
            onMouseLeave={(e) => {
                setHover(false);
            }}
            onClick={(e) => {
                onClick();
            }}
        >
            {name}
        </div>
    )
}

export default DropdownOption;