import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { Modal, ModalHeader } from 'components/Modal';
import { Align, Center, Column, Grid, Row } from 'components/layout';
import useHotkey from 'hooks/useHotkey';
import useModalDisappear from 'hooks/useModalDisappear';
import { useTranslation } from 'react-i18next';
import RTSelectWidget from './RTSelectWidget';
import { useState } from 'react';
import EditMetadataWidget from './EditMetadataWidget';
import { useProfile } from 'hooks/context';

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
    const profile = useProfile();
    const { t } = useTranslation();
    const [disappear, close] = useModalDisappear(onClose);
    const [step, setStep] = useState<NewRTModalStep>(NewRTModalStep.SelectRTType);
    const [rtMode, setRTMode] = useState<RTMode>('prompt_only');

    useHotkey({
        'Escape': close,
    }, isFocused, []);

    return (
        <Modal
            disappear={disappear}
            style={{
                minWidth: '400px',
                width: 'auto',
            }}
        >
            <ModalHeader
                title={t('rt.new_rt_title')}
                onClose={close}
            />
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
                <EditMetadataWidget
                    onPrev={()=>{
                        setStep(NewRTModalStep.SelectRTType);
                    }}
                    onConfirm={async (metadata)=>{
                        await profile.addRT({
                            name: metadata.name,
                            id: metadata.id,
                            mode: rtMode,
                        });
                        
                        onAddRT(metadata.id, rtMode);
                    }}
                />
            }
        </Modal>
    )
}

export default NewRTModal;