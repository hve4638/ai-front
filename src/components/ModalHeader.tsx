import React from 'react'
import { GoogleFontIconButton } from './GoogleFontIcon.tsx'

interface ModalHeaderProps {
    className?:string
    name:string,
    onClose:()=>void
}

export default function ModalHeader({className='', name, onClose}:ModalHeaderProps) {
    return (
        <div className={`modal-header undraggable ${className}`}>
            <h2>{name}</h2>
            <GoogleFontIconButton
                className='close-button'
                onClick={()=>onClose()}
                value='close'
            />x
        </div>
    )
}