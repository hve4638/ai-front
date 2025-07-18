import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import Button from 'components/Button';
import { Modal, ModalHeader } from 'components/Modal';
import { Align, Center, Column, Flex, Grid, Row } from 'components/layout';
import useModalDisappear from 'hooks/useModalDisappear';
import { useTranslation } from 'react-i18next';
import useHotkey from 'hooks/useHotkey';
import { ConfirmCancelButtons } from 'components/ModalButtons';
import UploadForm from '@/components/UploadForm';
import { StringForm, StringLongForm } from '@/components/Forms';

type StringInputModalProps = {
    title: string;
    apiKeyName?: string;
    editMode?: boolean;

    memo?: string;

    onSubmit?: (x: { authKey: string; memo: string; }) => Promise<boolean> | boolean | undefined | void;
    onClose?: () => void;
}

function AddAPIKeyModal({
    title,
    apiKeyName,
    editMode = false,
    memo = '',
    onSubmit = () => { return; },
    onClose = () => {},
}: StringInputModalProps) {
    const { t } = useTranslation();
    const [disappear, close] = useModalDisappear(() => onClose());
    const [authKey, setAuthKey] = useState<string>('');
    const [currentMemo, setCurrentMemo] = useState<string>(memo);

    useHotkey({
        'Escape': () => {
            close();
        }
    })

    return (
        <Modal
            className='relative'
            disappear={disappear}
            style={{
                width: 'auto',
                minWidth: '400px',
            }}
        >
            <ModalHeader hideCloseButton={true}>{title}</ModalHeader>
            <div style={{ height: '0.5em' }} />
            <StringLongForm
                name={apiKeyName ?? 'API Key'}
                value={authKey}
                onChange={(value) => setAuthKey(value)}
                instantChange={true}
                placeholder={editMode ? '변경 없음' : ''}
            />
            <div style={{ height: '0.25em' }} />
            <StringLongForm
                name='메모'
                value={currentMemo}
                onChange={(value) => setCurrentMemo(value)}
                instantChange={true}
            />
            <div style={{ height: '1em' }} />
            <ConfirmCancelButtons
                onConfirm={async () => {
                    let result = onSubmit({ authKey, memo: currentMemo });
                    if (result == undefined) close();

                    if (result && typeof result['then'] === 'function') {
                        result = await result;
                    }
                    if (result || result == undefined) {
                        close();
                    }
                }}
                onCancel={() => close()}
                enableConfirmButton={authKey.length > 0 || editMode}
            />
        </Modal>
    )
}

export default AddAPIKeyModal;