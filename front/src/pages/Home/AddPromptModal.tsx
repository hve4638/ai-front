import Button from 'components/Button';
import { StringForm, StringLongForm } from 'components/Forms';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { Modal, ModalHeader } from 'components/Modal';
import { Align, Center, Column, Grid, Row } from 'components/layout';
import { MODAL_DISAPPEAR_DURATION } from 'data';
import useHotkey from 'hooks/useHotkey';
import useModalDisappear from 'hooks/useModalDisappear';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type AddPromptModalProps = {
    onAddPrompt: (type: 'simple'|'node') => void;

    isFocused: boolean;
    onClose: () => void;
}

function AddPromptModal({
    onAddPrompt = ()=>{},

    isFocused,
    onClose = ()=>{},
}:AddPromptModalProps) {
    const { t } = useTranslation();
    const [disappear, close] = useModalDisappear(onClose);

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
            <ModalHeader onClose={close}>{t('rt.create-rt-title')}</ModalHeader>
            <Row
                rowAlign={Align.Start}
                columnAlign={Align.Center}
            >
                <RTTypeButton value='description' text={t('rt.create-simple-prompt')}/>
                <div style={{width:'4px'}}/>
                <RTTypeButton value='polyline' text={t('rt.create-node-flow-mode')}/>
            </Row>
            <div style={{height:'8px'}}/>
            {/* <Row>
                <Button>{t('create_label')}</Button>
                <Button>{t('cancel_label')}</Button>
            </Row> */}
        </Modal>
    )
}

type RTTypeButtonProps = {
    value : string;
    text : string;
}

function RTTypeButton({
    value, text
}:RTTypeButtonProps) {
    return (
        <Grid
            className='prompt-add-button'
            columns='80px'
            rows='64px 16px 4px'
            style={{
                padding : '0.5em',
            }}
        >
            <Center>
                <GoogleFontIcon
                    style={{
                        height: 'auto',
                        fontSize: '36px',
                    }}
                    value={value}
                />
            </Center>
            <span
                className='flex'
                style={{
                    textAlign: 'center',
                }}
            >
                <small>{text}</small>
            </span>
        </Grid>
    );
}

export default AddPromptModal;


// <Column
//                 className='undraggable prompt-add-button'
//                 style={{
//                     width : '96px',
//                     height : '128px',
//                 }}
//             >
//                 <GoogleFontIcon
//                     style={{
//                         height: 'auto',
//                         width: '36px',
//                         marginRight: '0.5em',
//                     }}
//                     value={value}
//                 />
//                 <span className='flex'>{text}</span>
//             </Column>