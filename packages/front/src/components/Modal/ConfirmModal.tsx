import { Align, Row } from 'components/layout';
import { ModalHeader } from '.';
import Modal from './Modal';
import Button from 'components/Button';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { MODAL_DISAPPEAR_DURATION } from 'data';

interface ConfirmModalProps {
    title?:string;
    children?:React.ReactNode;
    confirmText?:string;
    cancelText?:string;
    onConfirm?:()=>boolean;
    onCancel?:()=>boolean;
    onClosed:()=>void;
    enableRoundedBackground?:boolean

    className?:string;
    style?:React.CSSProperties;
    confirmButtonClassName?:string,
    cancelButtonClassName?:string,
}

function ConfirmModal({
    title,
    children,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm = ()=>true,
    onCancel = ()=>true,
    onClosed,
    confirmButtonClassName='',
    cancelButtonClassName='',

    enableRoundedBackground = false,

    className='',
    style={},
}:ConfirmModalProps) {
    const [disappear, setDisappear] = useState(true);

    useEffect(()=>{
        setTimeout(() => {
            setDisappear(false);
        }, 1);
    }, []);

    const close = () => {
        setDisappear(true);
        setTimeout(() => {
            onClosed();
        }, MODAL_DISAPPEAR_DURATION);
    }

    return (
        <Modal
            className={className}
            style={style}
            disappear={disappear}
            enableRoundedBackground={enableRoundedBackground}
        >
            {
                title != null &&
                <h2>
                    {title}
                </h2>
            }
            <div
                className='undraggable'
                style={{
                    fontSize: '0.9em',
                    padding: '4px 0.5em 1em 0.5em',
                    display: 'block'
                }}
            >
                {
                    children != null &&
                    children
                }
            </div>
            <Row
                rowAlign={Align.End}
            >
                <Button
                    className={
                        classNames(
                            confirmButtonClassName,
                        )
                    }
                    style={{
                        width: '90px'
                    }}
                    onClick={()=>{
                        if (onConfirm()) {
                            close();
                        }
                    }}
                >{confirmText}</Button>
                <Button
                    className={
                        classNames(
                            cancelButtonClassName,
                        )
                    }
                    style={{
                        width: '90px',
                        marginLeft: '6px',
                    }}
                    onClick={()=>{
                        if (onCancel()) {
                            close();
                        }
                    }}
                >{cancelText}</Button>
            </Row>
        </Modal>
    )
}

export default ConfirmModal;