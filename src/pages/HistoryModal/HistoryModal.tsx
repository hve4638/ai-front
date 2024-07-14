import React, { useState, useContext, useEffect } from 'react'
import ModalHeader from '../../components/ModalHeader.tsx'
import { StoreContext } from "../../context/StoreContext.tsx";
import { MemoryContext } from '../../context/MemoryContext.tsx';
import { APIResponse } from '../../data/interface.tsx';

interface HistoryModalProps {
    onClose:()=>void;
    onClick:(x:APIResponse)=>void;
} 

function HistoryModal({ onClose, onClick }:HistoryModalProps) {
    const memoryContext = useContext(MemoryContext);
    const storeContext = useContext(StoreContext);
    if (storeContext == null) throw new Error('HistoryModal() required StateContextProvider');
    if (memoryContext == null) throw new Error('MemoryModal() required StateContextProvider');

    const {
        currentHistory
    } = memoryContext;
    
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
        <div id='history-modal' className='modal undraggable'>
            <ModalHeader
                name='기록'
                onClose = {()=>onClose()}
            />
            <div className='history-container scrollbar'>
                {
                [...currentHistory].reverse().map((value, index) => (
                    <div
                        key={index}
                        className='history'
                        onClick={(e)=>onClick(value)}
                    >
                        <p className='history-input'>{value.input}</p>
                        <p className='history-output'>{value.output}</p>
                    </div>
                ))
                }
                <div className='center info' style={{margin: '50px 0px 50px 0px'}}>
                    기록은 사이트를 나가면 사라집니다
                </div>
            </div>
        </div>
    )
}

  
export default HistoryModal;