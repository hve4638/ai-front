import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import Button from 'components/Button';
import { Modal, ModalHeader } from 'components/Modal';
import { Align, Center, Column, Flex, Grid, Row } from 'components/layout';
import useModalDisappear from 'hooks/useModalDisappear';
import { useTranslation } from 'react-i18next';
import useHotkey from 'hooks/useHotkey';
import { ConfirmCancelButtons } from 'components/ModalButtons';

type StringInputModalProps = {
    title:string;
    aboveDescription?:string;
    belowDescription?:string;
    placeholder?:string;
    onSubmit?:(value:string)=>Promise<boolean>|boolean|undefined|void;
    onClose?:()=>void;
}

function StringInputModal({
    title,
    aboveDescription,
    belowDescription,
    placeholder,
    onSubmit = () => { return; },
    onClose = () => {},
}:StringInputModalProps) {
    const { t } = useTranslation();
    const [disappear, close] = useModalDisappear(()=>onClose());
    const [text, setText] = useState<string>('');

    useHotkey({
        'Escape': ()=>{
            close();
        }
    })

    return (
        <Modal
            className='relative'
            disappear={disappear}
            style={{
                width : 'auto',
                minWidth: '400px',
            }}
        >
            <ModalHeader hideCloseButton={true}>{title}</ModalHeader>
            <div style={{height: '1em'}}/>
            <div className={classNames('undraggable')}>
            {
                aboveDescription?.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                ))
            }
            </div>
            <input
                className='input-number'
                type='text'
                value={text}
                style={{
                    width : '100%',
                }}
                placeholder={placeholder}
                onChange={(e)=>setText(e.target.value)}
            />
            <div className={classNames('undraggable')}>
            {
                belowDescription?.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                ))
            }
            </div>
            <div style={{height: '0.5em'}}/>
            <ConfirmCancelButtons
                onConfirm={async ()=>{
                    let result = onSubmit(text);
                    if (result == undefined) close();
                    
                    if (result && typeof result['then'] === 'function') {
                        result = await result;
                    }
                    if (result || result == undefined) {
                        close();
                    }
                }}
                onCancel={()=>close()}
                enableConfirmButton={text.length > 0}
            />
        </Modal>
    )
}

export default StringInputModal;