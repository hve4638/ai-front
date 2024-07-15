import React, { useState, useContext, useRef, useEffect } from 'react'
import { SecretContext } from '../../context/SecretContext.tsx'
import ModalHeader from '../../components/ModalHeader.tsx'
import { PopUpMenu } from '../../components/PopUpMenu.tsx'
import { AIModels, MODELS } from '../../features/chatAI/index.ts'
import { ButtonFull, InputFull, InputSmall, SelectFull } from './Forms.tsx'
import { CommonOptions } from './options/CommonOptions.tsx'
import { GeminiOptions } from './options/GeminiOptions.tsx'
import { GPTOptions } from './options/GPTOptions.tsx'
import { ClaudeOptions } from './options/ClaudeOptions.tsx'
import { GoogleVertexAIOptions } from './options/GoogleVertexAIOptions.tsx'

import { getCookies, removeCookie } from "../../libs/cookies.tsx";

interface SettingModalProps {
    onClose:()=>void
}

function SettingModal(props:SettingModalProps) {
    const secretContext = useContext(SecretContext);
    if (secretContext == null) {
        throw new Error('SettingModel required SecretContextProvider')
    }
    
    const modalRef:any = useRef(null);
    const [size, setWidth] = useState({width:0, height:0});

    const onClose = ()=>{
        props.onClose();
    }

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
    }, [props.onClose]);
    
    return (
        <div
            id='setting-modal'
            className='modal undraggable column'
            ref = {modalRef}
        >
            <ModalHeader
                name='설정'
                onClose = {()=>onClose()}
            />
            <div style={{height:'16px'}}/>
            <ButtonFull
                name="데이터 초기화"
                onClick={()=>{
                    for (const name of getCookies()) {
                        removeCookie(name);
                    }
                    window.location.reload();
                }}
            />
        </div>
    )
}

export default SettingModal;