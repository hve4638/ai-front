import DivButton from '@/components/DivButton';
import { ButtonForm, CheckBoxForm, DropdownForm, StringForm, StringLongForm } from '@/components/Forms';
import { Modal, ModalHeader } from '@/components/Modal';
import { ConfirmCancelButtons } from '@/components/ModalButtons';
import { useModal } from '@/hooks/useModal';
import useModalDisappear from '@/hooks/useModalDisappear';
import { useState } from 'react';
import SelectAuthKeyModal from './SelectAuthKeyModal';
import useHotkey from '@/hooks/useHotkey';
import { DeleteConfirmDialog } from '@/modals/Dialog';
import { GIconButton } from '@/components/GoogleFontIcon';

interface EditCustomModelModalProps {
    value?: CustomModelCreate;
    onConfirm?: (value: CustomModelCreate) => Promise<boolean | void>;
    onDelete?: (customId: string) => Promise<boolean | void>;
    onClose?: () => void;
    isFocused?: boolean;
}

function EditCustomModelModal({
    value = {
        name: '',
        model: '',
        url: '',
        api_format: 'chat_completions',
        thinking: false,
        secret_key: '',
    },
    onConfirm = async () => { },
    onClose = () => { },
    onDelete = async () => { },
    isFocused = true,
}: EditCustomModelModalProps) {
    const modal = useModal();
    const [disappear, close] = useModalDisappear(onClose);
    const [name, setName] = useState(value.name);
    const [model, setModel] = useState(value.model);
    const [url, setURL] = useState(value.url);
    const [requestFormat, setRequestFormat] = useState(value.api_format);
    const [authSecretKey, setAuthSecretKey] = useState<string>(value.secret_key ?? '');
    const [thinking, setThinking] = useState(value.thinking);

    useHotkey({
        'Escape': () => {
            close();
        },
    }, isFocused);

    return (
        <Modal
            className='relative'
            disappear={disappear}
            style={{
                width: 'auto',
                minWidth: '400px',
            }}
        >
            <ModalHeader
                buttonRenderer={() => (
                    value.id != undefined
                        ? (
                            <GIconButton
                                value='delete'
                                hoverEffect='square'
                                onClick={() => {
                                    modal.open(DeleteConfirmDialog, {
                                        onDelete: async () => {
                                            await onDelete(value.id!);
                                            close();
                                            return true;
                                        },
                                    });
                                }}
                            />
                        )
                        : <></>
                )}
            >커스텀 모델</ModalHeader>
            <div style={{ height: '0.25em' }} />
            <StringForm
                name='이름'
                value={name}
                onChange={(value) => setName(value)}
                instantChange={true}
            />
            <div style={{ height: '0.5em' }} />
            <StringForm
                name='모델'
                value={model}
                onChange={(value) => setModel(value)}
                instantChange={true}
            />
            <div style={{ height: '0.5em' }} />
            <StringLongForm
                name='URL'
                value={url}
                onChange={(value) => setURL(value)}
                instantChange={true}
            />
            <div style={{ height: '0.75em' }} />
            <DropdownForm
                name='요청 형식'
                value={requestFormat}
                onChange={(value) => setRequestFormat(value.key as 'chat_completions')}
                onItemNotFound={() => {
                    setRequestFormat('chat_completions');
                }}
                items={[
                    { key: 'chat_completions', name: 'Chat Completions' },
                    { key: 'anthropic_claude', name: 'Anthropic Claude' },
                    { key: 'generative_language', name: 'Google Generative Language' },
                ]}
            />
            <div style={{ height: '0.25em' }} />
            {/* <CheckBoxForm
                name='추론 모델 여부'
                checked={thinking}
                onChange={(value) => setThinking(value)}
            /> */}
            <ButtonForm
                name='API 키'
                text='변경'
                onClick={() => {
                    modal.open(SelectAuthKeyModal, {
                        value: authSecretKey,
                        onChange: (value) => setAuthSecretKey(value),
                    });
                }}
            />
            <div style={{ height: '0.5em' }} />
            <ConfirmCancelButtons
                onConfirm={async () => {
                    const next = {
                        id: value.id,
                        name,
                        model,
                        url,
                        api_format: requestFormat,
                        thinking: thinking,
                        secret_key: authSecretKey,
                    };
                    const result = await onConfirm(next);

                    if (result ?? true) close();
                }}
                onCancel={() => close()}
                enableConfirmButton={model !== '' && url !== '' && name !== ''}
            />
        </Modal>
    )
}

export default EditCustomModelModal;