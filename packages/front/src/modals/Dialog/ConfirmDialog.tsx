import classNames from 'classnames';

import { Align, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/Modal';
import Button from '@/components/Button';

import useModalDisappear from '@/hooks/useModalDisappear';

import { CommonDialogProps } from './types';

interface ConfirmDialogProps extends CommonDialogProps {
    confirmText?:string;
    cancelText?:string;
    onConfirm?:()=>boolean;
    onCancel?:()=>boolean;
    enableRoundedBackground?:boolean

    confirmButtonClassName?:string,
    cancelButtonClassName?:string,
}

function ConfirmDialog({
    title,
    children,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm = ()=>true,
    onCancel = ()=>true,
    onClose,
    confirmButtonClassName='',
    cancelButtonClassName='',

    enableRoundedBackground = false,

    className='',
    style={},
}:ConfirmDialogProps) {
    const [disappear, close] = useModalDisappear(onClose);

    return (
        <Modal
            className={className}
            style={style}
            disappear={disappear}
            enableRoundedBackground={enableRoundedBackground}
        >
            <ModalHeader
                hideCloseButton={true}
            >
                {title}
            </ModalHeader>
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
                style={{
                    gap : '6px',
                }}
            >
                <Button
                    className={classNames(confirmButtonClassName)}
                    style={{ minWidth: '6em' }}
                    onClick={()=>{
                        if (onConfirm()) {
                            close();
                        }
                    }}
                >{confirmText}</Button>
                <Button
                    className={classNames(cancelButtonClassName, 'transparent')}
                    style={{ minWidth: '6em' }}
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

export default ConfirmDialog;