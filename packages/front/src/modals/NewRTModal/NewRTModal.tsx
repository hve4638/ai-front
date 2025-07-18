import { Modal, ModalHeader } from 'components/Modal';
import useHotkey from 'hooks/useHotkey';
import useModalDisappear from 'hooks/useModalDisappear';
import { useTranslation } from 'react-i18next';
import RTSelectWidget from './RTSelectWidget';
import { useState } from 'react';
import EditMetadataLayout from './layout/EditMetadataLayout';
import { useProfileEvent } from '@/stores';

const enum NewRTModalStep {
    SelectRTType = 0,
    EditMetadata = 1,
}

type NewRTModalProps = {
    onAddRT: (rtId: string, rtMode:RTMode) => void;

    isFocused: boolean;
    onClose: () => void;
}

function NewRTModal({
    onAddRT = ()=>{},

    isFocused,
    onClose = ()=>{},
}:NewRTModalProps) {
    const profile = useProfileEvent();
    const { t } = useTranslation();
    const [disappear, close] = useModalDisappear(onClose);
    const [step, setStep] = useState<NewRTModalStep>(NewRTModalStep.SelectRTType);
    const [rtMode, setRTMode] = useState<RTMode>('prompt_only');

    useHotkey({
        'Escape' : close,
    }, isFocused, []);

    return (
        <Modal
            disappear={disappear}
            style={{
                width: 'auto',
                maxWidth: '80%',
            }}
        >
            <ModalHeader onClose={close}>{t('rt.new_rt_title')}</ModalHeader>
            {
                step === NewRTModalStep.SelectRTType &&
                <RTSelectWidget
                    onPrev={close}
                    onSelectRTType={(selected)=>{
                        setRTMode(selected);
                        setStep(NewRTModalStep.EditMetadata);
                    }}
                />
            }
            {
                step === NewRTModalStep.EditMetadata &&
                <EditMetadataLayout
                    onPrev={()=>{
                        setStep(NewRTModalStep.SelectRTType);
                    }}
                    onConfirm={async (metadata)=>{
                        await profile.createRT({
                            name: metadata.name,
                            id: metadata.id,
                            mode: rtMode,
                        }, metadata.templateId);
                        
                        onAddRT(metadata.id, rtMode);
                    }}
                />
            }
        </Modal>
    )
}

export default NewRTModal;