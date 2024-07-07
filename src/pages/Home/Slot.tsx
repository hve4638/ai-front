import React, { useContext, useEffect, useRef, useState } from 'react'
import { PromptContext } from '../../context/PromptContext.tsx';

interface SlotAdderProps {
    onClick:()=>void,
}

export const SlotAdder = ({onClick}:SlotAdderProps) => (
    <div
        className='noflex prompt-slot center'
        onClick={(e)=>onClick()}
        onContextMenu={(event)=>{
            event.preventDefault();
        }}
    >+</div>
)

interface SlotProps {
    index:number,
    value:any,
    onClick:()=>void,
    onDelete:()=>void,
    onEdit:()=>void
}

export const Slot = ({ index, value, onClick, onDelete, onEdit}:SlotProps) => {
    const targetRef = useRef<HTMLDivElement>();
    const [h, setH] = useState(0);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [showTooptip, setShowTooltip] = useState(false);
    

    useEffect(()=>{
        if (targetRef.current) {
          const rect = targetRef.current.getBoundingClientRect();
          setH(Math.ceil(rect.height));
        }
    }, []);

    return (
        <div
            ref={targetRef}
            onClick={()=>onClick()}
            onContextMenu={(e)=>{
                e.preventDefault();
                setIsOpenMenu(true);
            }}
            onMouseEnter={(e)=>setShowTooltip(true)}
            onMouseLeave={(e)=>setShowTooltip(false)}
            className='noflex prompt-slot center'
        >
            {
                isOpenMenu &&
                <SlotContextMenu
                    onClose={()=>setIsOpenMenu(false)}
                    onEdit={()=>{
                        onEdit();
                        setIsOpenMenu(false);
                    }}
                    onDelete={()=>{
                        onDelete();
                        setIsOpenMenu(false);
                    }}
                    x={0}
                    y={-5}
                />
            }
            {
                showTooptip &&
                <SlotTooltip
                    value={value}
                    x={0}
                    y={-10}
                />
            }
            {index}
        </div>
    )
}

interface SlotContextMenuProps {
    x:number,
    y:number,
    onClose:()=>void,
    onEdit:()=>void,
    onDelete:()=>void
}

const SlotContextMenu = ({x, y, onClose, onEdit, onDelete}:SlotContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const onGlobalClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
  
    useEffect(()=>{ 
      document.addEventListener('click', onGlobalClick);
      return () => {
        document.removeEventListener('click', onGlobalClick);
      };
    },[])
  
    const width = 140;
    const height = 65;
    return (
        <div
            className='prompt-slots-context-menu column sub-center'
            style={{top: y - height, left:x - width/2}}
            ref={menuRef}
        >
            <div className='menu-item undraggable'
                onClick={(event)=>{
                    event.stopPropagation();
                    onEdit();
                }}
            >
                <span className="material-symbols-outlined" style={{alignSelf:'center'}}>edit</span>
                현재 상태 저장
            </div>
            <div
                className='menu-item undraggable red'
                onClick={(event)=>{
                    event.stopPropagation();
                    onDelete();
                }}
            >
                <span className="material-symbols-outlined" style={{alignSelf:'center'}}>delete</span>
                삭제
            </div>
        </div>
    )
}

function SlotTooltip({x, y, value}) {
    const targetRef = useRef<HTMLDivElement>();
    const [h, setH] = useState(0);
    const [texts, setTexts] = useState<string[]>([]);
    const promptContext = useContext(PromptContext);
    
    if (promptContext == null) throw new Error('SlotTooltip required PromptContext')

    useEffect(()=>{
        if (targetRef.current) {
          const rect = targetRef.current.getBoundingClientRect();
          setH(Math.ceil(rect.height));
        }
    });

    useEffect(()=>{
        try {
            const arr:string[] = [];
            const p1 = value.prompt1;
            const p2 = value.prompt2;
            const names = findNamePromptAsKey(promptContext.prompts, p1, p2);
            if (names == null) throw '';
            else if (names[1] == null)  {
                arr.push(`${names[0]}`);
            }
            else {
                arr.push(`${names[0]} (${names[1]})`);
            }
            for (const k in value.note)  {
                const v = value.note[k];
                arr.push(`- ${k} : ${v}`);
            }

            setTexts(arr);
        }
        catch (e) {
            setTexts(['error']);
        }
    }, [value]);
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
                            width : '140px',
                        }}>
                        {text}
                    </div>
                ))
            }
        </div>
    )
}

const findNamePromptAsKey = (prompts, key1:string, key2:string|null) => {
    for (const prompt of prompts) {
        if (prompt.key == key1) {
            if (prompt.list != null) {
                for (const subprompt of prompt.list) {
                    if (subprompt.key == key2) {
                        return [ prompt.name, subprompt.name ];
                    }
                }
            }
            else {
                return [ prompt.name, null ];
            }
        }
    }
    return null;
}