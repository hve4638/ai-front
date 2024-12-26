import { GoogleFontIcon } from "components/GoogleFontIcon";
import React, { useEffect, useState, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import DropdownList from "./DropdownList";
import type { DropdownItem, DropdownItemList } from './types';
import DropdownOption from './DropdownOption';

interface LayerDropdownProps {
    className?:string;
    listClassName?:string;
    itemClassName?:string;

    style?: React.CSSProperties;
    listStyle?: React.CSSProperties;
    itemStyle?: React.CSSProperties;

    items: (DropdownItem|DropdownItemList)[];
    value: string;
    
    onItemNotFound?: ()=>void;
    renderSelectedItem?: (item: DropdownItem, parentList?: DropdownItemList|undefined) => React.ReactNode;

    onChange?: (item: DropdownItem) => void;
}

/**
 * 2계층까지 구성 가능한 드롭다운 컴포넌트
 * 
 * @param {(DropdownItem|DropdownItemList)[]} items - Array of items to be displayed in the dropdown.
 * @param {string} value - 선택된 아이템의 key 값
 * @param {(item: DropdownItem) => void} [onChange]
 
 * @param {string} [className] - 컨테이너 클래스
 * @param {string} [listClassName] - 리스트 컨테이너의 클래스
 * @param {string} [itemClassName] - 각 아이템의 클래스
 * @param {React.CSSProperties} [style] 
 */
function Dropdown({
    className='',
    listClassName='',
    itemClassName='',
    style={},
    listStyle={},
    itemStyle={},

    items=[],
    value,

    onChange = ()=>{},
    onItemNotFound = ()=>{},
    renderSelectedItem = (item)=>(<span>{item.name}</span>),
}: LayerDropdownProps) {
    const headerRef:React.Ref<HTMLDivElement> = useRef(null);
    const mainListRef:React.Ref<HTMLDivElement> = useRef(null);
    const subListRef:React.Ref<HTMLDivElement> = useRef(null);
    
    const [isOpen, setIsOpen] = useState(false);
    const [focusFirstItem, setFocusFirstItem] = useState<DropdownItem|DropdownItemList|null>(null);
    const [focusOptionRect, setFocusOptionRect] = useState<{ top: number; left: number; width: number; height: number; }>();

    const currentItemList = useRef<DropdownItemList|undefined>(undefined);
    const currentItem = useMemo(()=>{
        for (const item of items) {
            if ('list' in item) {
                for (const subitem of item.list) {
                    if (subitem.key === value) {
                        currentItemList.current = item;
                        return subitem;
                    }
                }
            }
            else if (item.key === value) {
                currentItemList.current = undefined;
                return item;
            }
        }
        
        onItemNotFound();
        return {
            name: '',
            key: '',
        }
    }, [items, value, onItemNotFound]);

    const currentName = useMemo(()=>{
        return renderSelectedItem(currentItem, currentItemList.current);
    }, [currentItem, currentItemList]);

    useEffect(()=>{ 
        const handleClick = (event) => {
            if (isOpen) {
                if (
                    (headerRef.current?.contains(event.target)) ||
                    (mainListRef.current?.contains(event.target)) ||
                    (subListRef.current?.contains(event.target))
                ) {
                    // nothing to do
                }
                else {
                    setIsOpen(false);
                }
            }
        }

        if (!isOpen) {
            setFocusFirstItem(null);
        }
        
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [isOpen]);

    return (
        <div
            className={`dropdown-container ${className}`}
            style={style}
        >
            <div
                className='dropdown-header flex'
                onClick={() => setIsOpen(prev => !prev)}
                ref={headerRef}
            >
                {currentName}
                <GoogleFontIcon value='arrow_drop_down'/>
            </div>
            {
                isOpen &&
                ReactDOM.createPortal(
                <DropdownList
                    className={listClassName}
                    style={listStyle}
                    ref={mainListRef}
                    parentRef={headerRef}
                    reposition={({left, bottom, width}) => ({
                        left,
                        top : bottom + 2,
                        width,
                    })}
                >
                    {
                        items.map((item, index) => (
                            <DropdownOption
                                key={index}
                                className={itemClassName}
                                style={itemStyle}
                                item={item}
                                onFocus={(rect) =>  {
                                    setFocusOptionRect(rect ?? {
                                        top: 0,
                                        left: 0,
                                        width: 0,
                                        height: 0,
                                    });
                                    setFocusFirstItem(item);
                                }}
                                onClick={() => {
                                    if ('list' in item) {
                                        // nothing to do
                                    }
                                    else {
                                        setIsOpen(false);
                                        if (value !== item.key) {
                                            onChange(item);
                                        }
                                    }
                                }}
                            />
                        ))
                    }
                </DropdownList>
                , document.getElementById('app') ?? document.body)
            }
            {
                isOpen &&
                focusFirstItem !== null &&
                'list' in focusFirstItem &&
                ReactDOM.createPortal(
                <DropdownList
                    className={listClassName}
                    ref={subListRef}
                    parentRef={mainListRef}
                    reposition={({left, width}) => ({
                        left : left + width + 2,
                        top : focusOptionRect?.top ?? 0,
                        width, 
                    })}
                >
                    {
                        focusFirstItem.list.map((item, index) => (
                            <DropdownOption
                                key={index}
                                className={itemClassName}
                                item={item}
                                onClick={() => {
                                    setIsOpen(false);
                                    if (value !== item.key) {
                                        onChange(item);
                                    }
                                }}
                            />
                        ))
                    }
                </DropdownList>
                , document.getElementById('app') ?? document.body)
            }
        </div>
    );
};

export default Dropdown;