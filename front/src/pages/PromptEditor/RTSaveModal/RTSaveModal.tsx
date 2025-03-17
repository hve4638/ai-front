import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './styles.module.scss';

import { MODAL_DISAPPEAR_DURATION } from 'data';
import { Modal, ModalBackground, ModalHeader } from 'components/Modal';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { Align, Grid, Row } from 'components/layout';
import Button from 'components/Button';

import type { RTNodeTree, RTNode, RTNodeDirectory } from 'types/rt-node'
import RTTreeView from 'features/rtTreeView';
import useModalDisappear from 'hooks/useModalDisappear';

type RTSaveModalProps = {
    item:RTNodeTree;
    onConfirm: (item:RTMetadataTree) => void;
    onCancel: () => void;
    onClose: () => void;
}

function RTSaveModal({
    item,
    onConfirm,
    onCancel,
    onClose,
}:RTSaveModalProps) {
    const { t } = useTranslation();
    const [disappear, close] = useModalDisappear(onClose);
    const [tree, setTree] = useState<RTMetadataTree>(item);

    const submit = () => {
        onConfirm(tree);
        close();
    }
    const cancel = () => {
        onCancel();
        close();
    }

    return (
        <Modal
            disappear={disappear}
            style={{
                maxHeight: '80%',
            }}
        >
            <Grid
                columns='1fr'
                rows='48px 24px 1fr 6px 32px'
                style={{
                    height: '100%',
                }}
            >
                <ModalHeader
                    hideCloseButton={true}
                    title={t('prompt_editor.save')}
                />
                <Row
                    rowAlign={Align.End}
                >
                    <GoogleFontIcon
                        value='create_new_folder'
                        enableHoverEffect={true}
                        style={{
                            fontSize: '20px',
                            width: '22px',
                            height: '22px',
                        }}
                    />
                </Row>
                <RTTreeView
                    className={classNames(styles['tree-view'])}
                    tree={tree}
                    onChange={(next)=>setTree(next)}
                    relocatable
                />
                <div/>
                <Row
                    rowAlign={Align.End}
                    style={{
                        height: '100%',
                    }}
                >
                    <Button
                        onClick={submit}
                        style={{
                            width: '80px',
                            height: '100%',
                            marginRight: '8px'
                        }}
                    >확인</Button>
                    <Button
                        className='transparent'
                        onClick={cancel}
                        style={{
                            width: '80px',
                            height: '100%'
                        }}
                    >취소</Button>
                </Row>
            </Grid>
        </Modal>
    );
}

export default RTSaveModal;