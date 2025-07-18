import { useEffect, useRef, useState } from 'react';
import { Modal } from 'components/Modal';
import { Align, Column, Flex, Row } from 'components/layout';
import Button from 'components/Button';
import { ModalHeader } from 'components/Modal';
import { TextInput } from 'components/Input';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { MODAL_DISAPPEAR_DURATION } from 'data';
import useModalDisappear from 'hooks/useModalDisappear';
import { ButtonForm } from '@/components/Forms';
import { ProfileNameLayout } from './layout';
import { useModal } from '@/hooks/useModal';
import { DeleteConfirmDialog } from '@/modals/Dialog';
import useHotkey from '@/hooks/useHotkey';

interface EditProfileModalProps {
    name: string;
    onRename: (name: string) => void;
    onDelete: () => Promise<void>;
    onClose: () => void;
}

function EditProfileModal({
    name,
    onRename,
    onDelete,
    onClose,
}: EditProfileModalProps) {
    const modal = useModal();
    const [renamed, setRenamed] = useState(name);
    const [disappear, close] = useModalDisappear(onClose);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useHotkey({
        'Escape': (e) => {
            e.stopPropagation();
            close();
        }
    });

    return (
        <Modal
            disappear={disappear}
        >
            <ModalHeader onClose={close}>프로필 편집</ModalHeader>
            <div style={{ height: '16px' }} />
            <ProfileNameLayout
                style={{
                    padding: '0 12px',
                }}
                value={renamed}
                onChange={setRenamed}
            />
            <div style={{ height: '0.5em' }} />
            <ButtonForm
                style={{ padding: '0 12px', }}

                buttonClassName={classNames('red')}
                name='프로필 삭제'
                text='삭제'
                onClick={() => {
                    modal.open(DeleteConfirmDialog, {
                        onDelete: async () => {
                            await onDelete();
                            close();
                            return true;
                        }
                    });
                }}
            />
            <Row
                rowAlign={Align.End}
                style={{
                    width: '100%',
                    height: '32px',
                    gap: '12px',
                }}
            >
                <Button
                    style={{
                        width: '128px',
                        height: '100%'
                    }}
                    onClick={() => {
                        if (renamed !== '' && name !== renamed) {
                            onRename(renamed);
                        }

                        close();
                    }}
                >수정</Button>
                <Button
                    className='transparent'
                    style={{
                        width: '128px',
                        height: '100%'
                    }}
                    onClick={() => close()}
                >취소</Button>
            </Row>
        </Modal>
    )
}

export default EditProfileModal;