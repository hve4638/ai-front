import React from 'react'
import ModalHeader from 'components/ModalHeader'

interface DebugModalProps {
    onClose:()=>void
}

function DebugModal(props:DebugModalProps) {
    const onClose = ()=>{
        props.onClose();
    }
    return (
        <div
            className='modal setting-container undraggable column'
        >
            <ModalHeader
                name='DEBUG'
                onClose = {()=>onClose()}
            />
            <div style={{height:'12px'}}/>
            <button
                style={{margin: '8px 0px'}}
                onClick={async ()=>{
                    //@ts-ignore
                    const value = await window.electron.echo('[DEBUG] ECHO TEST');
                    console.log(value);
                }}
            >Echo</button>
            <button
                style={{margin: '8px 0px'}}
                onClick={async ()=>{
                    //@ts-ignore
                    window.electron.openPromptFolder();
                }}
            >Open Prompt Folder</button>
            <button
                style={{margin: '8px 0px'}}
                onClick={async ()=>{
                    //@ts-ignore
                    const value = await window.electron.loadPromptList();
                    console.log(value);
                }}
            >Load list.json</button>
            <button
                style={{margin: '8px 0px'}}
                onClick={async ()=>{
                    //@ts-ignore
                    const value = await window.electron.loadPrompt('template');
                    console.log(value);
                }}
            >Load template prompt</button>
        </div>
    )
}

export default DebugModal;