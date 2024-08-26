import React, { useState, useContext, useRef, useEffect } from 'react'

import useDebouncing from 'hooks/useDebouncing'

import { StoreContext } from 'context/StoreContext'
import { MemoryContext } from 'context/MemoryContext'

import ModalHeader from 'components/ModalHeader'
import Dropdown from 'components/Dropdown'

import { PROMPT_VAR_TYPE } from 'features/prompts'
import { NotImplementedError } from 'features/errors'

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
                onClose = { ()=>onClose() }
            />
            <div
                className='contents scrollbar'
            >
                {
                memoryContext.promptMetadata.vars.map((item, index)=>(
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

    switch (item.type) {
    case PROMPT_VAR_TYPE.SELECT:
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
        );
    case PROMPT_VAR_TYPE.TEXT:
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
        );
    case PROMPT_VAR_TYPE.TEXT_MULTILINE:
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
        );
    case PROMPT_VAR_TYPE.ARRAY:
    case PROMPT_VAR_TYPE.BOOLEAN:
    case PROMPT_VAR_TYPE.IMAGE:
    case PROMPT_VAR_TYPE.TUPLE:
    case PROMPT_VAR_TYPE.NUMBER:
    default:
        throw new NotImplementedError();
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