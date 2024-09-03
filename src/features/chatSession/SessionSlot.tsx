import React, { forwardRef, memo, useContext, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { PromptContext } from 'context/PromptContext';
import { MemoryContext } from 'context/MemoryContext';
import { EventContext } from 'context/EventContext';
import { ChatSession } from 'context/interface';
import { SlotContextMenu } from './SlotContextMenu';
import { FetchStatus } from 'data/interface';

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
    const memoryContext = useContext(MemoryContext);
    
    if (memoryContext == null) throw new Error('SlotTooltip required MemoryContext');
    const {
        promptMetadataTree
    } = memoryContext;

    useEffect(()=>{
        if (targetRef.current) {
          const rect = targetRef.current.getBoundingClientRect();
          setH(Math.ceil(rect.height));
        }
    });

    useEffect(()=>{
        try {
            const arr:string[] = [];
            
            //const index = promptList.getPromptIndex(session.promptKey);
            //const pl = promptList.getPromptMetadata(session.promptKey);
            const metadata = promptMetadataTree.getPromptMetadata(session.promptKey);
            
            if (metadata) {
                const indexes = metadata.indexes;
                if (indexes[1] == null) {
                    arr.push(metadata.name);
                }
                else {
                    const sublist = promptMetadataTree.list[indexes[0]];
                    
                    arr.push(`${sublist.name} (${metadata.name})`);
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