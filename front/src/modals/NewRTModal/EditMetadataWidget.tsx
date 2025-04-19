import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useProfileEvent } from '@/stores';
import Button from 'components/Button';
import { StringLongForm } from 'components/Forms';
import { Align, Column, Row } from 'components/layout';


type Metadata = {
    name : string;
    id : string;
}

type EditMetadataWidgetProps = {
    onPrev: () => void;
    onConfirm: (metadata:Metadata) => void;
}

function EditMetadataWidget({
    onPrev, onConfirm
}:EditMetadataWidgetProps) {
    const profile = useProfileEvent();
    const { t } = useTranslation();
    const [name, setName] = useState<string>('');
    const [id, setId] = useState<string>('');

    const [idValid, setIdValid] = useState<boolean>(false); 

    useEffect(()=>{
        profile.generateRTId()
            .then((nextId)=>{
                setId(nextId);
            });
    }, []);

    useEffect(()=>{
        if (id === '') {
            setIdValid(false);
        }
        else {
            isIdValid()
                .then(isValid=>{
                    setIdValid(isValid);
                });
        }
    }, [id]);

    const isIdValid = async ()=>{
        if(id === '') {
            return false;
        }
        const exist = await profile.hasRTId(id);
        return !exist;
    }

    return (
        <Column
            style={{
                minWidth: '400px',
            }}
        >
            <StringLongForm
                name={t('rt.name')}
                value={name}
                onChange={(next)=>setName(next)}
            />
            <StringLongForm
                name={t('rt.identifier')}
                value={id}
                onChange={(next)=>setId(next)}
            />
            <div style={{height:'4px'}}/>
            <Row
                className='wfill'
                rowAlign={Align.End}
                style={{
                    height : '1.5em',
                }}
            >
                <Button
                    disabled={
                        name === '' || !idValid
                    }
                    style={{
                        width : '96px',
                        height : '100%'
                    }}
                    onClick={async ()=>{
                        if (name === '') return;
                        if (id === '') return;
                        if (await profile.hasRTId(id)) {
                            return;
                        }

                        onConfirm({ name, id });
                    }}
                >{t('create_label')}</Button>
                <Button
                    className='transparent'
                    style={{
                        width : '96px',
                        marginLeft : '8px',
                    }}
                    onClick={onPrev}
                >{t('prev_label')}</Button>
            </Row>
            <div style={{height:'4px'}}/>
        </Column>
    )
}

export default EditMetadataWidget;