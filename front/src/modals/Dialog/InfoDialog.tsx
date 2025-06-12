import classNames from 'classnames';

import { Align, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/Modal';
import Button from '@/components/Button';

import useModalDisappear from '@/hooks/useModalDisappear';

import { CommonDialogProps } from './types';

interface InfoDialogProps extends CommonDialogProps {
    buttonText?:string;
    cancelText?:string;
    onConfirm?:()=>boolean;
    onCancel?:()=>boolean;
    enableRoundedBackground?:boolean

    buttonClassName?:string,
}

function InfoDialog({
    title,
    children,
    buttonText = '확인',
    onConfirm = ()=>true,
    onClose,
    buttonClassName='',

    enableRoundedBackground = false,

    className='',
    style={},
}:InfoDialogProps) {
    const [disappear, close] = useModalDisappear(onClose);

    return (
        <Modal
            className={className}
            style={style}
            disappear={disappear}
            enableRoundedBackground={enableRoundedBackground}
        >
            <ModalHeader hideCloseButton={true}>{title}</ModalHeader>
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
                    className={classNames(buttonClassName)}
                    style={{ minWidth: '6em' }}
                    onClick={()=>{
                        if (onConfirm()) {
                            close();
                        }
                    }}
                >{buttonText}</Button>
            </Row>
        </Modal>
    )
}

export default InfoDialog;