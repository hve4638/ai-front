import { useEffect, useRef, useState } from 'react';
import { Modal } from 'components/Modal';
import { Align, Column, Flex, Row } from 'components/layout';
import Button from 'components/Button';
import { ModalHeader } from 'components/Modal';
import { TextInput } from 'components/Input';
import classNames from 'classnames';

import useModalDisappear from 'hooks/useModalDisappear';
import { ButtonForm } from '@/components/Forms';
import { ProfileNameLayout } from './layout';
import { useModal } from '@/hooks/useModal';
import { ConfirmDialog, DeleteConfirmDialog } from '@/modals/Dialog';
import useHotkey from '@/hooks/useHotkey';

import styles from './styles.module.scss';
import ListView from '@/components/ListView/ListView';
import { GIconButton } from '@/components/GoogleFontIcon';

interface RecoverProfileModalProps {
    orphanIds: string[];
    onRecovery: () => Promise<void>;
    onClose: () => void;
}

function RecoverProfileModal({
    orphanIds,
    onRecovery,
    onClose,
}: RecoverProfileModalProps) {
    const modal = useModal();
    const [disappear, close] = useModalDisappear(onClose);

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
            <ModalHeader onClose={close}>프로필 복구</ModalHeader>
            <small style={{ paddingLeft: '0.5em', }}>예기치 못한 오류로 문제가 생긴 프로필을 복구합니다</small>
            <div style={{ height: '0.25em' }} />
            <ListView
                style={{
                    padding: '0 0.5em',
                }}
            >
                {
                    orphanIds.map((id) => (
                        <div>{id}</div>
                    ))
                }
                {
                    orphanIds.length === 0 &&
                    <div className='subtle-text'>없음</div>
                }
            </ListView>
            <div style={{ height: '8px' }} />

            <Row
                rowAlign={Align.End}
                style={{
                    width: '100%',
                    height: '32px',
                    gap: '12px',
                }}
            >
                <Button
                    className='green'
                    style={{
                        width: '128px',
                        height: '100%'
                    }}
                    onClick={async () => {
                        modal.open(ConfirmDialog, {
                            title: '프로필 복구',
                            children: <div>복구하시겠습니까?</div>,
                            onConfirm: () => {
                                onRecovery();
                                close();
                                return true;
                            },
                        });
                    }}
                    disabled={orphanIds.length === 0}
                >복구</Button>
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

export default RecoverProfileModal;