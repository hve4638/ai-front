import { ButtonForm, DropdownForm, StringForm, StringLongForm } from '@/components/Forms';
import { Column } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/Modal';
import { ConfirmCancelButtons } from '@/components/ModalButtons';
import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import styles from './styles.module.scss';
import { useDataStore } from '@/stores';
import { APIKeyMetadata } from '@/types/apikey-metadata';

interface SelectAuthKeyModalProps {
    value?: string;
    onChange?: (key: string) => void;
    onClose?: () => void;
}

function SelectAuthKeyModal({
    value = '',
    onChange = () => { },
    onClose = () => { },
}: SelectAuthKeyModalProps) {
    const [disappear, close] = useModalDisappear(onClose);
    const { api_keys } = useDataStore();
    const [selected, setSelected] = useState<string>(value);

    const {
        openAIAPIs,
        anthropicAPIs,
        googleAPIs,
        vertexAIAPIs,
        customAuth,
    } = useMemo(() => {
        return {
            openAIAPIs: api_keys['openai'] ?? [],
            anthropicAPIs: api_keys['anthropic'] ?? [],
            googleAPIs: api_keys['google'] ?? [],
            vertexAIAPIs: api_keys['vertexai'] ?? [],
            customAuth: api_keys['custom'] ?? []
        };
    }, [api_keys]);

    useHotkey({
        'Escape': () => close(),
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
            <ModalHeader hideCloseButton={false} onClose={close}>API 키 선택</ModalHeader>
            <div style={{ height: '0.25em' }} />
            <Column
                className={classNames(styles['select-auth-key-container'], 'undraggable')}
                style={{
                    padding: '0.2em 0',
                    gap: '0.25em',
                    overflow: 'hidden',
                }}
            >
                <div className={styles['model-name']}>OpenAI</div>
                <AuthKeyList apiKeys={openAIAPIs} selected={selected} onSelect={(value) => setSelected(value)} />
                <div className={styles['model-name']}>Anthropic</div>
                <AuthKeyList apiKeys={anthropicAPIs} selected={selected} onSelect={(value) => setSelected(value)} />
                <div className={styles['model-name']}>Google Cloud</div>
                <AuthKeyList apiKeys={googleAPIs} selected={selected} onSelect={(value) => setSelected(value)} />
                <div className={styles['model-name']}>Custom</div>
                <AuthKeyList apiKeys={customAuth} selected={selected} onSelect={(value) => setSelected(value)} />
                <div className={styles['shadow-wrapper']} />
            </Column>
            <div style={{ height: '0.25em' }} />
            <ConfirmCancelButtons
                onConfirm={async () => {
                    onChange(selected);
                    close();
                }}
                onCancel={() => close()}
                enableConfirmButton={selected !== value}
            />
        </Modal>
    )
}

interface AuthKeyListProps {
    apiKeys: APIKeyMetadata[];
    selected?: string;
    onSelect?: (key: string) => void;
}

function AuthKeyList({
    apiKeys,
    selected = '',
    onSelect = () => { },
}: AuthKeyListProps) {
    return apiKeys.map((metadata) => (
        <small
            key={metadata.secret_id}
            className={
                classNames(
                    styles['auth-key-item'],
                    { [styles['selected']]: metadata.secret_id === selected },
                )
            }
            onClick={() => {
                onSelect(metadata.secret_id);
            }}
        >
            {metadata.display_name} {metadata.memo != null && metadata.memo !== '' && `(${metadata.memo})`}
        </small>
    ))
}

export default SelectAuthKeyModal;