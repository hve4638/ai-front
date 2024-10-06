import React, { useEffect, useState } from 'react'
import ModalHeader from 'components/ModalHeader'
import {
    useContextForce,
    MemoryContext
} from 'context'

export function ErrorLogModal({
    onClose
 }) {
    const memoryContext = useContextForce(MemoryContext);

    return (
        <div id='errorlog-modal' className='modal'>
            <ModalHeader
                name='에러 로그'
                onClose = {()=>{
                    onClose()
                }}
            />
            <div className='contents scrollbar'>
                {
                    memoryContext.errorLogs.map((item, index) => (
                        <div className="error-box textfield flex">
                            <div className="name">{item.name}</div>
                            <pre className="message">
                                {item.message}
                            </pre>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}