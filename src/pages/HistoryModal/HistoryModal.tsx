import React, { useState, useContext, useEffect } from 'react'
import ModalHeader from '../../components/ModalHeader.tsx'
import { StoreContext } from "../../context/StoreContext.tsx";
import { MemoryContext } from '../../context/MemoryContext.tsx';
import { APIResponse } from '../../data/interface.tsx';
import { NOSESSION_KEY, TARGET_ENV } from '../../data/constants.tsx';

interface HistoryModalProps {
    onClose:()=>void;
    onClick:(x:APIResponse)=>void;
}

function HistoryModal({ onClose, onClick }:HistoryModalProps) {
    const memoryContext = useContext(MemoryContext);
    //const storeContext = useContext(StoreContext);
    if (memoryContext == null) throw new Error('MemoryModal() required StateContextProvider');
    //if (storeContext == null) throw new Error('HistoryModal() required StateContextProvider');

    const {
        currentSession,
        historyManager
    } = memoryContext;

    const [history, setHistory] = useState<APIResponse[]>([]);
    useEffect(()=>{
        const call = async ()=> {
            setHistory(await historyManager.load(currentSession));
        }
        call();
    }, []);
    
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
                history.map((item, index) => {
                    return <div
                        key={index}
                        className='history'
                        onClick={(e)=>onClick(item)}
                    >
                        <p className='history-input'>{item.input}</p>
                        <p className='history-output'>{item.output}</p>
                    </div>
                })
                }
                {
                    TARGET_ENV === "WEB" &&
                    <div className='center info' style={{margin: '20px 0px 20px 0px'}}>
                        기록은 사이트를 나가면 사라집니다
                    </div>
                }
            </div>
        </div>
    )
}

  
export default HistoryModal;