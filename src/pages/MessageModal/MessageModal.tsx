import React, { useState, useContext, useRef, useEffect } from 'react'
import ModalHeader from '../../components/ModalHeader.tsx'

interface VarEditorModalProps {
    title:any
    children?:any
    onClose:()=>void
}

function MessageModal(props:VarEditorModalProps) {
    const { onClose, title, children = (<></>) } = props;
    return (
        <div
            className='modal undraggable column'
        >
            <ModalHeader
                name={title}
                onClose = {()=>onClose()}
            />
            <div style={{height:'24px'}}/>
            {children}
        </div>
    )
}


export default MessageModal;