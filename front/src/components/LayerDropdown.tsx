import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

interface LayerDropdownProps {
  value:any;
  items:Item[];
  onChange:(x:any)=>void;
  style?:Object;
  className?:string;
  itemClassName?:string;
  onCompare?:(a:any, b:any)=>boolean;
  children?:any;
}

interface Item {
    name:string;
    value?:any;
    list?:Item[];
}

export function LayerDropdown({
  className='',
  itemClassName='',
  style={},
  value,
  items,
  onChange,
  onCompare=(a, b)=>a===b,
  children=null
}:LayerDropdownProps) {
    const dropdownRef:any = useRef(null);
    const mainListRef:any = useRef(null);
    const mainItemRef:any = useRef(null);;
    const subListRef:any = useRef(null);;

    let dropdownRect:any = {};
    const [mainListRect, setMainListRect] = useState<any>({});
    const [mainItemRect, setMainItemRect] = useState<any>({});

    const [title, setTitle] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [focusMainItem, setFocusMainItem] = useState<any>(null);
    const [hoverMainItem, setHoverMainItem] = useState<any>(null);

    useEffect(()=>{
        let found = false;
        for (const item of items) {
            if (item.list != undefined) {
                for (const subitem of item.list) {
                    if (onCompare(value, subitem.value)) {
                        setTitle(subitem.name);
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
            else if (value === item.value) {
                setTitle(item.name);
                found = true;
                break;
            }
        }
        if (!found) setTitle("");
    }, [value, items])
    
    if (dropdownRef.current) {
        dropdownRect = dropdownRef.current.getBoundingClientRect();
    }

    useEffect(()=>{
        if (mainItemRef.current) {
            setMainItemRect(mainItemRef.current.getBoundingClientRect());
        }
        if (mainListRef.current) {
            setMainListRect(mainListRef.current.getBoundingClientRect());
        }
    }, [focusMainItem, hoverMainItem])

    useEffect(()=>{
        if (hoverMainItem == null) return;
        
        const timeout = setTimeout(()=>{
            setFocusMainItem(hoverMainItem);
        }, 45);

        return ()=>{
            clearTimeout(timeout);
        }
    }, [hoverMainItem])

    useEffect(()=>{
        if (!isOpen) {
            setFocusMainItem(null);
        }
    }, [isOpen])

    useEffect(()=>{ 
        const handleClick = (event) => {
            if (isOpen) {
                if (
                    (dropdownRef?.current && dropdownRef.current.contains(event.target)) ||
                    (mainListRef?.current && mainListRef.current.contains(event.target)) ||
                    (subListRef?.current && subListRef.current.contains(event.target))
                ) {
                    
                }
                else {
                    setIsOpen(false);
                }
            }
        }
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    });

    return (
        <div className={`${className} dropdown2`} style={style} ref={dropdownRef}>
        <div className="dropdown2-header" onClick={() => setIsOpen(!isOpen)}>
            {
                children != null &&
                <>{children}</>
            }
            <span>{title}</span>
            <span className='dropdown2-arrow material-symbols-outlined'>arrow_drop_down</span>
        </div>
        {
            isOpen && ReactDOM.createPortal(
                <div
                    className={`${itemClassName} dropdown2-list`}
                    style={{
                        top: dropdownRect.bottom + 10,
                        left: dropdownRect.left,
                        minWidth: dropdownRect.width,
                    }}
                    ref={mainListRef}
                >
                {
                    items.map((item, index) => (
                        <div
                            key={index}
                            ref={focusMainItem === item ? mainItemRef : null}
                            className={
                                'dropdown2-item'
                                + ('list' in item ? ' cursordefault' : '')
                            }
                            onMouseEnter={(e)=>{
                                setHoverMainItem(item);
                            }}
                            onMouseLeave={(e)=>{
                                setHoverMainItem(previousItem=>{
                                    if (previousItem === item) return null;
                                    else return previousItem;
                                });
                            }}
                            onClick={(e) => {
                                if (item.list == undefined) {
                                    setIsOpen(false);
                                    onChange(item.value);
                                }
                            }}
                        >
                        {item.name}
                        </div>
                    ))
                }
                </div>
            ,document.getElementById('app') ?? document.body)
        }
        {
            isOpen
            && focusMainItem
            && 'list' in focusMainItem
            && ReactDOM.createPortal(
                <div
                    className={`${itemClassName} dropdown2-sublist`}
                    style={{
                        top: mainItemRect.top ?? (dropdownRect.bottom + 10),
                        left: dropdownRect.left + 1 + (mainListRect.width ?? 0),
                    }}
                    ref={subListRef}
                >
                {
                    focusMainItem.list.map((item, index) => (
                        <div
                            key={index}
                            className="dropdown2-item"
                            onClick={(e) => {
                                setIsOpen(false);
                                onChange(item.value);
                            }}
                        >
                            {item.name}
                        </div>
                    ))
                }
                </div>
            ,document.getElementById('app') ?? document.body)
        }
        </div>
    );
};