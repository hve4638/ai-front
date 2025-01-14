import { Modal, ModalBackground, ModalHeader } from "components/Modal";
import { MODAL_DISAPPEAR_DURATION } from "data";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type PromptTreeModalProps = {
    onClose: () => void;
}

function PromptTreeModal({
    onClose,
}:PromptTreeModalProps) {
    const { t } = useTranslation();
    const [disappear, setDisappear] = useState(true);

    const onExit = () => {
        setDisappear(true);
        setTimeout(() => {
            onClose();
        }, MODAL_DISAPPEAR_DURATION);
    }

    useEffect(()=>{
        setTimeout(()=>setDisappear(false), 1);
    }, [])

    return (
        <Modal
            disappear={disappear}
            style={{
                height: '80%',
                maxHeight: '80%',
            }}
        >
            <ModalHeader
                hideCloseButton={true}
                title={t('prompt.save')}
            />
            
        </Modal>
    );
}

export default PromptTreeModal;