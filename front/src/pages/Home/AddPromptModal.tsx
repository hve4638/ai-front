import { GoogleFontIcon } from "components/GoogleFontIcon";
import { Modal, ModalHeader } from "components/Modal";
import { Align, Grid, Row } from "components/layout";
import { MODAL_DISAPPEAR_DURATION } from "data";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type AddPromptModalProps = {
    onAddPrompt: (type: 'simple'|'node') => void;
    onClose: () => void;
}

function AddPromptModal({
    onAddPrompt = ()=>{},
    onClose = ()=>{},
}:AddPromptModalProps) {
    const { t } = useTranslation();
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
                minWidth: '230px',
                width: 'auto',
            }}
        >
            <ModalHeader
                title={t('rt.create-rt-title')}
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
                        marginRight: '0.5em',
                    }}
                    value='description'
                />
                <span className='flex'>{t('rt.create-simple-prompt')}</span>
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
                        marginRight: '0.5em',
                    }}
                    value='polyline'
                />
                <span className='flex'>{t('rt.create-node-flow-mode')}</span>
            </Row>
        </Modal>
    )
}

export default AddPromptModal;