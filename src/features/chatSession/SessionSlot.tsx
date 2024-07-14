import React, { forwardRef, memo, useContext, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { PromptContext } from '../../context/PromptContext.tsx';
import { MemoryContext } from '../../context/MemoryContext.tsx';
import { ChatSession } from '../../context/interface.ts';
import { SlotContextMenu } from './SlotContextMenu.tsx';
import { EventContext } from '../../context/EventContext.tsx';
import { FetchStatus } from '../../data/interface.ts';

interface SlotAdderProps {
    onClick:()=>void,
}

export const SessionSlotAdder = ({onClick}:SlotAdderProps) => (
    <div
        className='session-slot'
        onClick={(e)=>onClick()}
        onContextMenu={(event)=>{
            event.preventDefault();
        }}
    >+</div>
)

interface SlotProps {
    index:number;
    className?:string;
    selected:boolean;
    session:ChatSession;
    onClick:()=>void;
    onDelete:()=>void;
    onSessionChange:(data:ChatSession)=>void;
}

export const SessionSlot = ({ index, className='', session, selected=false, onClick, onDelete, onSessionChange}:SlotProps) => {
    const memoryContext = useContext(MemoryContext);
    const eventContext = useContext(EventContext);
    if (!memoryContext) throw new Error("<SessionSlot/> required MemoryContextProvider");
    if (!eventContext) throw new Error("<SessionSlot/> required EventContextProvider");

    const targetRef = useRef<HTMLDivElement>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [showTooptip, setShowTooltip] = useState(false);
    const [alert, setAlert] = useState('');

    const {
        apiFetchResponse,
    } = memoryContext;
    const {
        getFetchStatus,
    } = eventContext;

    let rect;
    if (targetRef.current) {
        rect = targetRef.current.getBoundingClientRect();
    }

    useEffect(()=>{
        if (!session.chatIsolation) {
            setAlert('');
            return;
        }
        const status = getFetchStatus(session);
        
        switch(status) {
        case FetchStatus.IDLE:
            setAlert('');
            break;
        case FetchStatus.COMPLETE:
            setAlert('complete');
            break;
        case FetchStatus.ERROR:
            setAlert('error');
            break;
        case FetchStatus.PROCESSING:
        case FetchStatus.QUEUED:
            setAlert('loading');
            break;
        }
    }, [apiFetchResponse]);

    const extraClass = `${className} ${selected ? 'selected' : ''} ${alert}`

    return (
        <>
            <div
                className={
                    `session-slot ${extraClass}`
                }
                ref={targetRef}
                onClick={()=>onClick()}
                onContextMenu={(e)=>{
                    e.preventDefault();
                    setIsOpenMenu(true);
                }}
                onMouseEnter={(e)=>setShowTooltip(true)}
                onMouseLeave={(e)=>setShowTooltip(false)}
            >
                {index}
            {
                showTooptip && !isOpenMenu &&
                <SlotTooltip
                    session={session}
                    x={0}
                    y={-10}
                />
            }
            </div>
            {
                isOpenMenu &&
                ReactDOM.createPortal(
                    <div >
                        <SlotContextMenu
                            ref={contextMenuRef}
                            index={index}
                            session={session}
                            onClose={()=>setIsOpenMenu(false)}
                            onChange={(data)=>onSessionChange(data)}
                            onDelete={()=>{
                                onDelete();
                                setIsOpenMenu(false);
                            }}
                            x={rect?.left ?? 0}
                            y={(rect?.top ?? 0) - 80}
                        />
                    </div>,
                    document.getElementById('app') ?? document.body
                )
            }
        </>
    )
}

function SlotTooltip({x, y, session}) {
    const targetRef = useRef<HTMLDivElement>(null);
    const [h, setH] = useState(0);
    const [texts, setTexts] = useState<string[]>([]);
    const promptContext = useContext(PromptContext);
    const memoryContext = useContext(MemoryContext);
    
    if (promptContext == null) throw new Error('SlotTooltip required PromptContext');
    if (memoryContext == null) throw new Error('SlotTooltip required MemoryContext');
    const {
        promptList
    } = promptContext;

    useEffect(()=>{
        if (targetRef.current) {
          const rect = targetRef.current.getBoundingClientRect();
          setH(Math.ceil(rect.height));
        }
    });

    useEffect(()=>{
        try {
            const arr:string[] = [];
            const index = promptList.getPromptIndex(session.promptKey);
            const pl = promptList.getPrompt(session.promptKey);
            
            if (pl && index) {
                if (index.length == 1) {
                    arr.push(pl.name);
                }
                else if (index.length == 2) {
                    const sublist = promptList.list[index[0]]
                    
                    arr.push(`${sublist.name} (${pl.name})`);
                }
                
                for (const key in session.note)  {
                    const value = session.note[key];
                    arr.push(`- ${key} : ${value}`);
                }
    
                setTexts(arr);
            }
            else {
                throw null;
            }
        }
        catch (e) {
            setTexts(['error']);
        }
    }, [session]);
    return (
        <div
            className='session-slot-tooltip column'
            style={{top:y-h, left:x}}
            ref={targetRef}
        >
            {
                texts.map((text, index)=>(
                    <div
                        key={index}
                        className='item'
                        style={{
                            maxWidth : '140px',
                        }}>
                        {text}
                    </div>
                ))
            }
        </div>
    )
}