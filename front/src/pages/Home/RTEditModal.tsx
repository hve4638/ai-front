import { useEffect, useLayoutEffect, useState } from 'react';
import Button from 'components/Button';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { Align, Grid, Row } from 'components/layout';
import { Modal, ModalHeader } from 'components/Modal';
import { ProfileContext, useContextForce } from 'context';
import RTTreeView from 'features/rtTreeView';
import useHotkey from 'hooks/useHotkey';
import useModalDisappear from 'hooks/useModalDisappear';
import { useTranslation } from 'react-i18next';
import { RTNodeTree } from 'types/rt-node';

type RTEditModalProps = {
    onClickCreateNewRT: () => void;
    isFocused: boolean;
    onClose: () => void;
}

function RTEditModal({
    onClickCreateNewRT,
    isFocused,
    onClose
}:RTEditModalProps) {
    const { t } = useTranslation();
    const profileContext = useContextForce(ProfileContext);
    const [disappear, close] = useModalDisappear(onClose);

    const [tree, setTree] = useState<RTNodeTree>([]);

    useLayoutEffect(()=>{
        profileContext.getRTTree().then((tree)=>{
            console.log('tree');
            console.log(tree);
            setTree(tree);
        });
    }, []);

    useHotkey({
        'Escape': close,
    }, isFocused, []);

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
                    title={t('rt.rt-edit')}
                    onClose={close}
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
                    tree={tree}
                    onChange={(next)=>setTree(next)}
                />
                <div/>
                <Row
                    rowAlign={Align.End}
                    style={{
                        height: '100%',
                    }}
                >
                    <Button
                        onClick={onClickCreateNewRT}
                        style={{
                            minWidth: '80px',
                            height: '100%'
                        }}
                    >{t('rt.rt-create')}</Button>
                </Row>
            </Grid>
        </Modal>
    );
}

export default RTEditModal;