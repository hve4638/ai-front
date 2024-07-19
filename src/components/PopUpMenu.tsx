import React, { useEffect, useRef, useState } from 'react'

interface PopUpMenuProps {
    title:string;
    item:{name,value}[];
    style?:object;
    onClick:(value:string)=>void
    onClickOutside:()=>void
}

export function PopUpMenu({
    title,
    onClick,
    item,
    style = {},
    onClickOutside
}:PopUpMenuProps) {
    const targetRef = useRef(null);

    const onGlobalClick = (event) => {
        const element = targetRef.current as HTMLElement|null;
        if (element && !element.contains(event.target)) {
            onClickOutside();
        }
    }
    useEffect(()=>{
        let isLoaded = false;
        const timerId = setTimeout(()=>{
            document.addEventListener('click', onGlobalClick);
            isLoaded = true;
        }, 0);
        
        return () => {
            if (isLoaded) {
                document.removeEventListener('click', onGlobalClick);
            }
            else {
                clearTimeout(timerId);
            }
        };
    },[]);

    return (
        <div
            className='popup-menu column undraggable'
            style={style}
            ref={targetRef}
        >
            <p className='title center'>{title}</p>
            <hr/>
            {
                item.map(({name, value}, index)=>(
                    <div
                        className='popup-menu-item undraggable center'
                        onClick={(e)=>onClick(value)}
                        key={index}
                    >
                        {name}
                    </div>
                ))
            }
        </div>
    )
}