import { useEffect, useState } from 'react';
import { Modal, ModalHeader } from 'components/Modal';
import { DropdownForm, StringForm } from 'components/Forms';
import { Align, Row } from 'components/layout';
import { MODAL_DISAPPEAR_DURATION } from 'data';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import useLazyThrottle from 'hooks/useLazyThrottle';
import { ProfileEventContext, ProfileStorageContext, useContextForce } from 'context';
import classNames from 'classnames';
import useHotkey from 'hooks/useHotkey';

type Metadata = Required<{
    name:string;
    id:string;
}>;

type MetadataEditModalProps = {
    metadata:Metadata;
    onChange:(metadata:Metadata)=>Promise<boolean>;
    onClose:()=>void;
}

function MetadataEditModal({
    metadata,
    onChange,
    onClose
}:MetadataEditModalProps) {
    const {
        hasRTId
    } = useContextForce(ProfileEventContext);
    const { t } = useTranslation();
    const [disappear, setDisappear] = useState(true);
    const [currentName, setCurrentName] = useState(metadata.name);
    const [currentId, setCurrentId] = useState(metadata.id);
    const [validId, setValidId] = useState(true);

    const checkIsValidId = useLazyThrottle(async (id:string)=>{
        hasRTId(id).then((exists)=>setValidId(!exists));
    }, 10);

    const setCurrentIdAndCheck = (id:string) => {
        setCurrentId(id);
        checkIsValidId(id)
    }

    const submit = async () => {
        if (await onChange({
            name: currentName,
            id: currentId,
        })) {
            close();
        }
    }

    const close = () => {
        setDisappear(true);
        setTimeout(()=>{
            onClose();
        }, MODAL_DISAPPEAR_DURATION);
    }

    useEffect(()=>{
        setTimeout(()=>setDisappear(false), 1);
    }, []);
    
    useHotkey({
        'Enter' : (e)=>{
            submit();
            return true;
        },
        'Escape' : (e)=>{
            close();
            return true;
        }
    });

    return (
        <Modal
            disappear={disappear}
        >
            <ModalHeader
                title={t('prompt_editor.metadata_edit_title')}
                onClose={close}
            />
            <StringForm
                name={t('prompt_editor.name_label')}
                value={currentName}
                onChange={setCurrentName}
                width='18em'
            />
            <StringForm
                name={t('prompt_editor.id_label')}
                value={currentId}
                onChange={setCurrentIdAndCheck}
                width='18em'
                warning={''}
            />
            <Row
                style={{
                    marginTop: '1em',
                    height: '1.8em',
                }}
                rowAlign={Align.End}
            >
                <Button
                    className={
                        classNames(
                            'hfill',
                            { disabled : !validId }
                        )
                    }
                    style={{
                        width : '80px',
                        marginRight: '8px'
                    }}
                    onClick={submit}
                >{t('submit_label')}</Button>
                <Button
                    className='hfill transparent'
                    style={{
                        width : '80px'
                    }}
                    onClick={()=>{
                        close();
                    }}
                >{t('cancel_label')}</Button>
            </Row>
        </Modal>
    )
}

export default MetadataEditModal;