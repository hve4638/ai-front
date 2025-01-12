import { GoogleFontIcon } from "components/GoogleFontIcon";
import { Modal, ModalHeader } from "components/Modal";
import { Align, Grid, Row } from "components/layout";
import { MODAL_DISAPPEAR_DURATION } from "data";
import { useEffect, useState } from "react";

type AddPromptModalProps = {
    onAddPrompt: (type: 'simple'|'node') => void;
    onClose: () => void;
}

function AddPromptModal({
    onAddPrompt = ()=>{},
    onClose = ()=>{},
}:AddPromptModalProps) {
    const [disappear, setDisappear] = useState(true);

    useEffect(()=>{
        setTimeout(()=>{
            setDisappear(false);
        }, 1);
    }, []);
    
    const close = ()=>{
        setDisappear(true);
        setTimeout(()=>{
            onClose();
        }, MODAL_DISAPPEAR_DURATION);
    }

    return (
        <Modal
            disappear={disappear}
            style={{
                width: '230px'
            }}
        >
            <ModalHeader
                title='생성'
                onClose={close}
            />
            <Row
                className='undraggable prompt-add-button'
                rowAlign={Align.Start}
                columnAlign={Align.Center}
                onClick={()=>onAddPrompt('simple')}
            >
                <GoogleFontIcon
                    style={{
                        height: 'auto',
                        width: '36px',
                    }}
                    value='description'
                />
                <span className='flex center'>단순 프롬프트</span>
            </Row>
            <div style={{height:'8px'}}/>
            <Row
                className='undraggable prompt-add-button'
                rowAlign={Align.Start}
                columnAlign={Align.Center}
            >
                <GoogleFontIcon
                    style={{
                        height: 'auto',
                        width: '36px',
                    }}
                    value='polyline'
                />
                <span className='flex center'>노드 프롬프트</span>
            </Row>
        </Modal>
    )
}

export default AddPromptModal;