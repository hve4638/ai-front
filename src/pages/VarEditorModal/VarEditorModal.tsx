import React, { useState, useContext, useRef, useEffect } from 'react'
import { getCookies, removeCookie } from '../../libs/cookies.tsx'
import { SecretContext } from '../../context/SecretContext.tsx'
import ModalHeader from '../../components/ModalHeader.tsx'
import { PopUpMenu } from '../../components/PopUpMenu.tsx'
import { AIModels, MODELS } from '../../features/chatAI/index.ts'
import { StoreContext } from '../../context/StoreContext.tsx'
import Dropdown from '../../components/Dropdown.tsx'
import useDebouncing from '../../hooks/useDebouncing.ts'
import { MemoryContext } from '../../context/MemoryContext.tsx'

interface VarEditorModalProps {
    onClose:()=>void
}

function VarEditorModal({onClose}:VarEditorModalProps) {
    const storeContext = useContext(StoreContext);
    const memoryContext = useContext(MemoryContext);
    if (!storeContext) throw new Error('VarEditorModal required StoreContextProvider');
    if (!memoryContext) throw new Error('VarEditorModal required StoreContextProvider');
    const {
        currentSession,
        setCurrentSession,
        promptInfomation,
    } = memoryContext;

    const modalRef:any = useRef(null);

    useEffect(()=>{
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
                event.preventDefault();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            id='vareditor-modal'
            className='modal vareditor-container undraggable column'
            ref = {modalRef}
        >
            <ModalHeader
                name='변수'
                onClose = {()=>onClose()}
            />
            <div
                className='contents scrollbar'
            >
                {
                promptInfomation.allVars.map((item, index)=>(
                    <VarEditor
                        key={index}
                        item={item}
                        value={item.name in currentSession.note ? currentSession.note[item.name] : null}
                        onChange={(value)=>{
                            const newCurrentSession = {...currentSession};
                            const newNote = {...currentSession.note};
                            newNote[item.name] = value;
                            newCurrentSession.note = newNote;
                            setCurrentSession(newCurrentSession);
                        }}
                    />
                ))
                }
            </div>
        </div>
    )
}

const VarEditor = ({item, value, onChange}) => {
    const [input, setInput] = useDebouncing(value, (value)=>onChange(value), 100);

    if (item.type === "select") {
        return (
            <div className='vareditor row main-spacebetween'>
                <div className='bold'>{item.display_name}</div>
                <Dropdown
                    items={item.options}
                    value={value}
                    onChange={(value)=>onChange(value)}
                    titleMapper={dropdownValueFinder}
                />
            </div>
        )
    }
    else if (item.type === "text") {
        return (
            <div className='vareditor column'>
                <div className='bold' style={{marginBottom: '8px'}}>{item.display_name}</div>
                <input
                    type="text"
                    style={{height:"5px"}}
                    value={input}
                    onChange={(e)=>setInput(e.target.value)}
                />
            </div>
        )
    }
    else if (item.type === "text-multiline") {
        return (
            <div className='vareditor column'>
                <div className='bold' style={{marginBottom: '8px'}}>{item.display_name}</div>
                <textarea
                    spellCheck={false}
                    className='scrollbar fontstyle'
                    style={{
                        height: '100px'
                    }}
                    value={input}
                    onChange={(e)=>setInput(e.target.value)}
                />
            </div>
        )
    }
}

const dropdownValueFinder = (value, items) => {
    for (const item of items) {
        if (value == item.value) {
            return item.name;
        }
    }
}
  
export default VarEditorModal;