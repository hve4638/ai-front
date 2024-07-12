import React, { useState, useContext } from 'react'

import ModalHeader from '../../components/ModalHeader.tsx'

import { StoreContext } from "../../context/StoreContext.tsx";

import { APIResponse } from '../../data/interface.tsx';
import { MemoryContext } from '../../context/MemoryContext.tsx';

interface HistoryModalProps {
    onClose:()=>void;
    onClick:(x:APIResponse)=>void;
} 

function HistoryModal({
    onClose,
    onClick
 }:HistoryModalProps) {
    const memoryContext = useContext(MemoryContext);
    const storeContext = useContext(StoreContext);
    if (storeContext == null) throw new Error('HistoryModal() required StateContextProvider');
    if (memoryContext == null) throw new Error('MemoryModal() required StateContextProvider');

    const {
        currentHistory
    } = memoryContext;

    const reverseHistory = [...currentHistory].reverse();
    
    return (
        <div className='modal history-modal undraggable column'>
            <ModalHeader
                name='기록'
                onClose = {()=>onClose()}
            />
            <div className='column scrollbar' style={{overflow:'auto'}}>
                {
                    reverseHistory.map((value, index) => (
                        <div
                            key={index}
                            className='history column'
                            onClick={(e)=>onClick(value)}
                        >
                            <p className='history-input'>{value.input}</p>
                            <p className='history-output'>{value.output}</p>
                        </div>
                    ))
                }
                <div className='noflex center info' style={{margin: '50px 0px 50px 0px'}}>
                    기록은 사이트를 나가면 사라집니다
                </div>
            </div>
        </div>
    )
}

  
export default HistoryModal;