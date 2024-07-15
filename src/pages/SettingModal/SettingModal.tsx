import React, { useState, useContext, useRef, useEffect, memo } from 'react'
import { SecretContext } from '../../context/SecretContext.tsx'
import ModalHeader from '../../components/ModalHeader.tsx'
import { ButtonFull, InputFull, InputSmall, SelectFull } from './Forms.tsx'

import { LayerDropdown } from '../../components/LayerDropdown.tsx'
import { MemoryContext } from '../../context/MemoryContext.tsx';
import { StoreContext } from '../../context/StoreContext.tsx';
import { LayoutModes } from '../../data/interface.ts';
import { resetAllValues } from '../../services/local/index.ts'

interface SettingModalProps {
    onClose:()=>void
}

function SettingModal(props:SettingModalProps) {
    const storeContext = useContext(StoreContext);
    const memoryContext = useContext(MemoryContext);
    const secretContext = useContext(SecretContext);
    if (!secretContext) throw new Error('SettingModel required SecretContextProvider')
    if (!memoryContext) throw new Error('SettingModel required MemoryContextProvider')
    if (!storeContext) throw new Error('SettingModel required StoreContextProvider')
    
    const modalRef:any = useRef(null);
    const {
        layoutMode, setLayoutMode
    } = storeContext;
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
            <div
                className='item row main-spacebetween'
                style={{alignItems:'center', paddingLeft: '8px'}}
            >
                <span><strong>레이아웃</strong></span>
                <LayerDropdown
                    value={layoutMode}
                    items={[
                        {name:'자동', value: LayoutModes.AUTO},
                        {name:'가로 고정', value: LayoutModes.HORIZONTAL},
                        {name:'세로 고정', value: LayoutModes.VERTICAL},
                    ]}
                    onChange={(value)=>{
                        setLayoutMode(value);
                    }}
                />
            </div>
            <ButtonFull
                name="데이터 초기화"
                onClick={async ()=>{
                    await resetAllValues();
                    window.location.reload();
                }}
            />
        </div>
    )
}

export default SettingModal;