import React, { useState, useContext, useRef, useEffect } from 'react'
import { getCookies, removeCookie } from '../../libs/cookies.tsx'
import { APIContext } from '../../context/APIContext.tsx'
import ModalHeader from '../../components/ModalHeader.tsx'
import { PopUpMenu } from '../../components/PopUpMenu.tsx'
import { AIModels, MODELS } from '../../features/chatAI/index.ts'
import { StateContext } from '../../context/StateContext.tsx'
import Dropdown from '../../components/Dropdown.tsx'
import useDebouncing from '../../hooks/useDebouncing.ts'

interface VarEditorModalProps {
    onClose:()=>void
}

function VarEditorModal(props:VarEditorModalProps) {
    const stateContext = useContext(StateContext);
    if (stateContext == null) {
        throw new Error('VarEditorModal required StateContextProvider')
    }
    const {
        note, setNote,
        prompt
    } = stateContext;

    const modalRef:any = useRef(null);

    const onClose = ()=>{
        props.onClose();
    }
    return (
        <div
            className='modal vareditor-container undraggable column'
            ref = {modalRef}
        >
            <ModalHeader
                name='변수'
                onClose = {()=>onClose()}
            />
            <div style={{height:'24px'}}/>
            <div
                className='vareditor-content column scrollbar'
            >
                {
                    prompt.allVars.map((item, index)=>(
                        <VarEditor
                            key={index}
                            item={item}
                            value={note[item.name]}
                            onChange={(value)=>setNote({...note, [item.name]:value})}
                        />
                    ))
                }
                <div style={{height:'12px'}}/>
            </div>
        </div>
    )
}

const VarEditor = ({item, value, onChange}) => {
    const [input, setInput] = useDebouncing(value, (value)=>onChange(value), 100);

    if (item.type === "select") {
        return (
            <div className='vareditor row main-spacebetween sub-center'>
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