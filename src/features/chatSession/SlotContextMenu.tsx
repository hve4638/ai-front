import React, { forwardRef, useEffect } from "react";
import { GoogleFontIconButton } from "../../components/GoogleFontIcon.tsx";
import { ChatSession } from "../../context/interface";
import { COLORBOX_COLORS } from "./interface.ts";

interface SlotContextMenuProps {
    x:number;
    y:number;
    index:number;
    session:ChatSession;
    onChange:(session:ChatSession)=>void;
    onClose:()=>void;
    onDelete:()=>void;
}

export const SlotContextMenu = forwardRef(({x, y, session, index, onClose, onDelete, onChange}:SlotContextMenuProps, ref) => {
    const colors = ["red", "orange", "yellow", "lime", "green", "aqua", "purple", "reset"]
    const onGlobalClick = (event) => {
      if (ref != null && ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }
  
    useEffect(()=>{ 
        let isLoaded = false;
        const timerId = setTimeout(()=>{
            document.addEventListener('click', onGlobalClick);
            document.addEventListener('contextmenu', onGlobalClick);
            isLoaded = true;
        }, 0);
        
        return () => {
            if (isLoaded) {
                document.removeEventListener('click', onGlobalClick);
                document.removeEventListener('contextmenu', onGlobalClick);
            }
            else {
                clearTimeout(timerId);
            }
        };
    },[])
  
    const width = 140;
    const height = 65;
    return (
        <div
            className='session-contextmenu-container'
            style={{top: y - height, left:x - width/2}}
            ref={ref}
        >
            <div
                className={`session-contextmenu column sub-center undraggable ${session.color}`}
            >
                <div style={{margin:"2px 0px"}}><strong>슬롯 {index}</strong></div>
                <div className="row slot-list-item">
                    {
                        colors.map((value, index)=>(
                            <ColorBox
                                onClick={(color)=>{
                                    const newSession = {...session};
                                    newSession.color = color;
                                    onChange(newSession);
                                }}
                                color={value}
                                value={value}
                                key={index}
                            />
                        ))
                    }
                </div>
                <div style={{height:"5px"}}/>
                <div className='wfill slot-list-item row main-start'>
                    <input type='checkbox'
                        checked={session.chatIsolation}
                        onChange={()=>{
                            const newSession = {...session};
                            newSession.chatIsolation = !session.chatIsolation;
                            onChange(newSession);
                        }}
                    />
                    <span className='center'>독립된 채팅</span>
                </div>
                <div className='wfill slot-list-item row main-start'>
                    <input type='checkbox'
                        checked={!session.historyIsolation}
                        onChange={()=>{
                            const newSession = {...session};
                            newSession.historyIsolation = !session.historyIsolation;
                            onChange(newSession);
                        }}
                    />
                    <span className='center'>독립된 History</span>
                </div>
                <div className="row slot-list-item slot-bottom undraggable">
                    <GoogleFontIconButton
                        className='session-slot-button'
                        value='delete'
                        onClick={()=>onDelete()}
                    />
                </div>
            </div>
        </div>
    )
})

function ColorBox({color, onClick, value}) {
    return (
        <div
            className='slot-colorbox clickable'
            style={{ backgroundColor: COLORBOX_COLORS[color]}}
            onClick={()=>onClick(value)}
        ></div>
    )
}