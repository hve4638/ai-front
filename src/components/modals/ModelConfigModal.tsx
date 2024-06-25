import React, {useContext} from 'react'

import ModalHeader from './ModalHeader.tsx'

import { StateContext } from '../../context/StateContext.tsx';

export default function ModelConfigModal({
    onClose
 }) {
    const stateContext = useContext(StateContext);
    if (stateContext == null) {
        throw new Error('ModelConfig requiered StateContextProvider');
    }
    
    const { note, promptContents } = stateContext;
    console.log('note!');
    console.log(note);
    
    return (
        <div className='modal config-modal column'>
            <ModalHeader
                name='Request 정보'
                onClose = {()=>{
                    onClose({})
                }}
            />
            <div className='column scrollbar' style={{ overflow:'auto'}}>
                <p className='noflex config-name undraggable'>Prompt</p>
                <div className='noflex textplace column scrollbar' style={{position:'relative'}}>
                {
                    promptContents.split('\n').map((value, index) => (
                        <pre key={index} className='fontstyle'>
                            {value == '' ? ' ' : value}
                        </pre>
                    ))
                }
                </div>
                <p className='noflex config-name undraggable'>Note</p>
                <div className='noflex textplace column'>
                    {
                        Object.entries(note).map(([key, value]) => (
                            <div key={key}>
                                {key} : {value}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}