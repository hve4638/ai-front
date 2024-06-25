import React, { useState, useContext } from 'react'

import ModalHeader from '../../components/ModalHeader.tsx'

import { StateContext } from "../../context/StateContext.tsx";

import { APIResponse } from '../../data/interface.tsx';

interface HistoryModalProps {
    onClose:()=>void;
    onClick:(x:APIResponse)=>void;
} 

function HistoryModal({
    onClose,
    onClick
 }:HistoryModalProps) {
    const stateContext = useContext(StateContext);
    if (stateContext == null) throw new Error('HistoryModal() required StateCntextProvider');

    const reverseHistory = [...stateContext.history].reverse();
    
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