import React, { useState, useContext, useRef, useEffect } from 'react'
import ModalHeader from 'components/ModalHeader'

import { PROMPT_VAR_TYPE } from 'features/prompts'
import { NotImplementedError } from 'features/errors'
import {
    EventContext,
    StoreContext,
    MemoryContext,
    useContextForce
} from 'context';
import { ArrayVarEditor } from './arrayVarEditor'
import { TextVarEditor } from './textVarEditor'
import { SelectVarEditor } from './selectVarEditor'
import { TextMultilineVarEditor } from './textMultilineVarEditor'
import { NumberVarEditor } from './numberVarEditor'
import { BooleanVarEditor } from './booleanVarEditor'
import { StructVarEditor } from './structVarEditor'
import { VarEditors } from './varEditors'

interface VarEditorModalProps {
    onClose:()=>void
}

export function VarEditorModal({onClose}:VarEditorModalProps) {
    const eventContext = useContextForce(EventContext);
    const storeContext = useContextForce(StoreContext);
    const memoryContext = useContextForce(MemoryContext);
    const {
        currentSession,
        currentPromptMetadata
    } = memoryContext;

    const modalRef:any = useRef(null);

    console.log('vem');
    console.log(currentPromptMetadata.getVarValues());

    // ESC 핸들링
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
            className='modal undraggable column'
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
                    memoryContext.currentPromptMetadata.vars.map((item, index)=>(
                        <VarEditors
                            key={index}
                            item={item}
                            value={currentPromptMetadata.getVarValue(item.name)}
                            onChange={(value)=>{
                                console.log('onChange');
                                console.log(`name: ${item.name}, value: ${value}`);
                                eventContext.setCurrentPromptMetadataVar(item.name, value);
                            }}
                        />
                    ))
                }
            </div>
        </div>
    )
}