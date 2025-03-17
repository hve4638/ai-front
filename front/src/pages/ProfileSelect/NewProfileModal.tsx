import { useEffect, useRef, useState } from 'react';
import { Modal } from 'components/Modal';
import { Align, Column, Flex, Row } from 'components/layout';
import Button from 'components/Button';
import { ModalHeader } from 'components/Modal';
import { TextInput } from 'components/Input';
import { ButtonForm, StringForm } from 'components/Forms';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { MODAL_DISAPPEAR_DURATION } from 'data';


function NewProfileModal({
    onSubmit,
    onClose,
}:{
    onSubmit: (metadata) => void
    onClose: () => void
}) {
    const [name, setName] = useState('');
    const [disappear, setDisappear] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    const onExit = () => {
        setDisappear(true);
        setTimeout(() => {
            onClose();
        }, MODAL_DISAPPEAR_DURATION);
    }

    useEffect(() => {
        inputRef.current?.focus();

        const keyDownHandler = (e)=>{
            if (e.key === 'Escape') {
                onExit();
            }
        }
        setTimeout(() => {
            setDisappear(false);
        }, 0);

        window.addEventListener('keydown', keyDownHandler);
        return () => {
            window.removeEventListener('keydown', keyDownHandler);
        }
    }, []);

    return (
        <Modal
            disappear={disappear}
        >
            <ModalHeader
                title='프로필 추가'
                onClose={
                    () => {
                        setDisappear(true);
                        setTimeout(() => {
                            onClose();
                        }, MODAL_DISAPPEAR_DURATION);
                    }
                }
            />
            <Column
                style={{
                    padding: '16px 16px 8px 16px'
                }}
            >
                <Row
                    rowAlign={Align.Center}
                    style={{
                        width : '100%',
                        padding : '8px',
                        boxSizing : 'border-box',
                        marginBottom: '24px'
                    }}
                >
                    <div
                        className='noflex'
                        style={{
                            width: '64px',
                            height: '64px',
                            backgroundColor: 'lightgray',
                            borderRadius: '8px'
                        }}
                    ></div>
                    <Flex
                        className='center'
                        style={{
                            height: '64px',
                            paddingLeft: '16px'
                        }}
                    >
                        <TextInput
                            ref={inputRef}
                            className={classNames('wfill', styles['profile-input'])}
                            placeholder='프로필 이름'
                            style={{
                                boxSizing: 'content-box',
                                padding: '2px 0.5em',
                                /// @TODO : 하드코딩된 폰트 사이즈
                                // fontSize: '16px',
                                height: '1.5em'
                            }}
                            value={name}
                            onChange={(value) => {
                                setName(value);
                            }}
                        />
                    </Flex>
                </Row>
                
                <Row
                    rowAlign={Align.End}
                    style={{
                        width : '100%',
                        height: '48px',
                        padding : '8px',
                        boxSizing : 'border-box'
                    }}
                >
                    <Button
                        className='green'
                        style={{
                            marginLeft: '12px',
                            width : '128px',
                            height : '100%'
                        }}
                        onClick={() => {
                            if (name === '') return;
                            
                            const metadata = {
                                name: name,
                                color: 'lightgray'
                            }
                            onSubmit(metadata)
                            setDisappear(true);
                            setTimeout(() => {
                                onClose();
                            }, MODAL_DISAPPEAR_DURATION);
                        }}
                        disabled={name.length === 0}
                    >
                        생성
                    </Button>
                    <Button
                        className='transparent'
                        style={{
                            marginLeft: '12px',
                            width : '128px',
                            height : '100%'
                        }}
                        onClick={() => {
                            setDisappear(true);
                            setTimeout(() => {
                                onClose();
                            }, MODAL_DISAPPEAR_DURATION);
                        }}
                    >
                        취소
                    </Button>
                </Row>
            </Column>
        </Modal>
    )
}

export default NewProfileModal;