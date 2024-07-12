import React, { forwardRef, useContext, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { PromptContext } from '../../context/PromptContext.tsx';
import { GoogleFontIconButton } from '../../components/GoogleFontIcon.tsx';
import { COLORBOX_COLORS } from './interface.ts'
import { MemoryContext } from '../../context/MemoryContext.tsx';
import { ChatSession } from '../../context/interface.ts';
import { SlotContextMenu } from './SlotContextMenu.tsx';

interface SlotAdderProps {
    onClick:()=>void,
}

export const SessionSlotAdder = ({onClick}:SlotAdderProps) => (
    <div
        className='noflex prompt-slot center'
        onClick={(e)=>onClick()}
        onContextMenu={(event)=>{
            event.preventDefault();
        }}
    >+</div>
)

interface SlotProps {
    index:number;
    selected:boolean;
    session:ChatSession;
    onClick:()=>void;
    onDelete:()=>void;
    onSessionChange:(data:ChatSession)=>void;
}

export const SessionSlot = ({ index, session, selected=false, onClick, onDelete, onSessionChange}:SlotProps) => {
    const targetRef = useRef<HTMLDivElement>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [showTooptip, setShowTooltip] = useState(false);

    let rect;
    if (targetRef.current) {
        rect = targetRef.current.getBoundingClientRect();
    }
    
    return (
        <>
            <div
                className={`noflex prompt-slot center ${selected ? 'selected' : ''}`}
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
    const conetextMenuRef = useRef<HTMLDivElement>(null);
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
            const pl = promptList.getPrompt(session.promptKey)
            
            if (pl) {
                arr.push(pl.name);
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
            className='prompt-slot-tooltip column'
            style={{top:y-h, left:x}}
            ref={targetRef}
        >
            {
                texts.map((text, index)=>(
                    <div
                        key={index}
                        className='prompt-slot-tooltip-text'
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