import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import ReactLoading from 'react-loading';

import { Align, Flex, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/Modal';
import Button from '@/components/Button';
import { StringForm } from '@/components/Forms';

import useModalDisappear from '@/hooks/useModalDisappear';

import styles from './styles.module.scss';

interface RecoveryKeySetupModalProps {
    onSubmit: (recoveryKey:string) => Promise<boolean>;
    onClose: () => void;
}

function RecoveryKeySetupModal({
    onSubmit,
    onClose,
}:RecoveryKeySetupModalProps) {
    const [disappear, close] = useModalDisappear(onClose);
    const [loading, setLoading] = useState(false);
    const [recoveryKey, setRecoveryKey] = useState('');
    const valid = useMemo(()=>recoveryKey.length >= 4, [recoveryKey]);

    const submit = async ()=>{
        if (!valid || loading) return;
        setLoading(true);
        
        const b = await onSubmit(recoveryKey);
        setLoading(false);
        if (b) {
            close();
        }
    }

    return (
        <Modal
            disappear={disappear}
            style={{
                width : 'auto',
                minWidth: '400px',
            }}
        >
            <ModalHeader hideCloseButton={true}>복구 키 설정</ModalHeader>
            <div style={{ height:'0.25em' }}/>
            <StringForm
                name='복구 키'
                value={recoveryKey}
                onChange={setRecoveryKey}
                className={classNames(styles['recovery-key-input'], 'undraggable')}
                style={{
                    width: '100%',
                    // height: '2.5em',
                    margin: '0.5em 0px',
                    // fontSize: '1.15em',
                }}
                instantChange={true}
            />
            <div
                className={classNames(styles['description'], 'undraggable')}
                style={{
                    maxWidth: '31em'
                }}
            >
                <div>API 키와 같은 중요한 정보를 암호화하는데 사용되며 하드웨어 및 OS 설정 변경 이후 복구키를 요구할 수 있습니다</div>
                <div>복구 키를 잃어버려도 API 키 등의 중요한 정보만 소실되며 기존 데이터는 유지됩니다</div>
            </div>
            <Row
                style={{
                    height: '1.4em',
                }}
                rowAlign={Align.End}
            >
                {
                    loading &&
                    <div
                        style={{
                            margin: 'auto 0px',
                            width: '2em',
                        }}
                    >
                        <ReactLoading
                            type={"spinningBubbles"}
                            height={'1em'}
                        />
                    </div>
                }
                <Button
                    className={
                        classNames(
                            'green',
                            {disabled: (!valid || loading)}
                        )
                    }
                    style={{
                        width: '96px',
                        height: '100%',
                    }}
                    onClick={submit}
                >확인</Button>
            </Row>
        </Modal>
    )
}

export default RecoveryKeySetupModal;