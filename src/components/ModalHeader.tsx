import React from 'react'

interface ModalHeaderProps {
    className?:string
    name:string,
    onClose:()=>void
}

export default function ModalHeader({className='', name, onClose}:ModalHeaderProps) {
    return (
        <div className={`${className} row undraggable`}>
            <h2 className='noflex'>{name}</h2>
            <div className='flex'/>
            <span
                className="material-symbols-outlined clickable modal-close-button"
                onClick={(e)=>onClose()}
                style={{fontSize:'34px'}}
            >
                close
            </span>
        </div>
    )
}