import { useEffect, useRef, useState } from 'react';
import { Modal } from 'components/Modal';
import { Align, Column, Flex, Row } from 'lib/flex-widget';
import Button from 'components/Button';
import { ModalHeader } from 'components/Modal';

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
        }, 200);
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
            title='프로필 추가'
            disappear={disappear}
        >
            <ModalHeader
                title='프로필 추가'
                onClose={
                    () => {
                        setDisappear(true);
                        setTimeout(() => {
                            onClose();
                        }, 200);
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
                        <input
                            ref={inputRef}
                            className='wfill profile-input'
                            type='text'
                            placeholder='프로필 이름'
                            style={{
                                padding: '8px',
                                fontSize: '16px',
                                height: '20px'
                            }}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </Flex>
                </Row>
                
                <Row
                    rowAlign={Align.End}
                    style={{
                        width : '100%',
                        padding : '8px',
                        boxSizing : 'border-box'
                    }}
                >
                    <Button
                        className='green'
                        style={{
                            marginLeft: '12px',
                            width : '128px'
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
                            }, 200);
                        }}
                        disabled={name.length === 0}
                    >
                        생성
                    </Button>
                    <Button
                        className='transparent'
                        style={{
                            marginLeft: '12px',
                            width : '128px'
                        }}
                        onClick={() => {
                            setDisappear(true);
                            setTimeout(() => {
                                onClose();
                            }, 200);
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