import { StringForm } from "components/Forms";
import { TextInput } from "components/Input";
import { Align, Flex, Row } from "components/layout";
import { Modal, ModalHeader } from "components/Modal";
import { useEffect, useMemo, useState } from "react";
import styles from './styles.module.scss';
import Button from "components/Button";
import classNames from "classnames";
import ReactLoading from 'react-loading';
import { MODAL_DISAPPEAR_DURATION } from "data";

interface RecoveryKeySetupModalProps {
    onSubmit: (recoveryKey:string) => Promise<boolean>;
    onClose: () => void;
}

function RecoveryKeySetupModal({
    onSubmit,
    onClose,
}:RecoveryKeySetupModalProps) {
    const [disappear, setDisappear] = useState(true);
    const [loading, setLoading] = useState(false);
    const [recoveryKey, setRecoveryKey] = useState('');
    const valid = useMemo(()=>recoveryKey.length >= 5, [recoveryKey]);

    useEffect(()=>{
        setTimeout(() => {
            setDisappear(false);
        }, 1);
    }, []);

    const close = () => {
        setDisappear(true);
        setTimeout(() => {
            onClose();
        }, MODAL_DISAPPEAR_DURATION);
    }

    return (
        <Modal
            disappear={disappear}
            style={{
                width : 'auto',
                minWidth: '400px',
            }}
        >
            <ModalHeader
                title='복구 키 설정'
                hideCloseButton={true}
            />
            <Row
                style={{
                    height: '1.4em',
                    margin: '0.5em 0.5em'
                }}
            >
                <span
                    className='noflex undraggable'
                    style={{
                        marginRight: '1em'
                    }}
                >
                    복구키
                </span>
                <input
                    type='text'
                    className='input-number flex'
                    value={recoveryKey}
                    onChange={(e)=>setRecoveryKey(e.target.value)}
                />
            </Row>
            <div
                className={classNames(styles['description'], 'undraggable')}
                style={{
                    maxWidth: '31em'
                }}
            >
                <div>기억하기 쉬운 복구키를 입력하세요.</div>
                <div>API키 등 중요한 정보를 암호화하는데 사용되며 하드웨어 및 OS 설정 변경 이후 복구키를 요구할 수 있습니다.</div>
            </div>
            <Row
                style={{
                    height: '1.4em',
                    margin: '0.5em 0.5em'
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
                    onClick={async ()=>{
                        if (!valid || loading) return;
                        setLoading(true);
                        
                        const b = await onSubmit(recoveryKey);
                        setLoading(false);
                        if (b) {
                            close();
                        }
                    }}
                >확인</Button>
            </Row>
        </Modal>
    )
}

export default RecoveryKeySetupModal;