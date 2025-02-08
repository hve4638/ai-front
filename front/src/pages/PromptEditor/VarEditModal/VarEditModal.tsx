import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Modal, ModalBackground, ModalBox, ModalHeader } from 'components/Modal';
import { DropdownForm, StringForm } from 'components/Forms';

import {
    Additions,
} from './additions';
import useSignal from 'hooks/useSignal';
import { dropdownItem, initPromptVar } from './utils';
import styles from './styles.module.scss';
import { Row } from 'components/layout';
import { MODAL_DISAPPEAR_DURATION } from 'data'

const VAR_DROPDOWN_ITEMS = [
    dropdownItem('텍스트', 'text'),
    dropdownItem('숫자', 'number'),
    dropdownItem('체크박스', 'checkbox'),
    dropdownItem('목록', 'select'),
    dropdownItem('구조체', 'struct'),
    dropdownItem('배열', 'array'),
]
const FIELD_DROPDOWN_ITEMS = [
    dropdownItem('텍스트', 'text'),
    dropdownItem('숫자', 'number'),
    dropdownItem('체크박스', 'checkbox'),
    dropdownItem('목록', 'select'),
]

type VarEditModalProps = {
    promptVar:PromptVar;
    onRefresh?:()=>void;
    onClose:()=>void;
}

function VarEditModal({
    promptVar,
    onRefresh = ()=>{},
    onClose
}:VarEditModalProps) {
    const [disappear, setDisappear] = useState(true);
    const [refreshSignal, sendRefreshSignal] = useSignal();
    const fieldRef = useRef<PromptVar|null>(null);
    
    useEffect(()=>{
        setTimeout(()=>{
            setDisappear(false);
        }, 1);

        const handleKeyDown = (e:KeyboardEvent) => {
            if (e.key == 'Escape') {
                close();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return ()=>window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useLayoutEffect(()=>{
        onRefresh();
        
        initPromptVar(promptVar);

        if (promptVar.type != 'struct') {
            fieldRef.current = null;
        }
        else {
            initPromptVar(fieldRef.current);
        }
    }, [refreshSignal]);

    const close = () => {
        setDisappear(true);
        setTimeout(()=>{
            onClose();
        }, MODAL_DISAPPEAR_DURATION);
    }

    return (
    <ModalBackground
        disappear={disappear}
    >
        <Row
            className={styles['modal-wrapper']}
            style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <ModalBox
                className={styles['var-editor-modal']}
                disappear={disappear}
            >
                <ModalHeader
                    title='변수 편집'
                    onClose={()=>close()}
                />
                <DropdownForm
                    name='타입'
                    value={promptVar.type}
                    items={VAR_DROPDOWN_ITEMS}
                    onChange={(item)=>{
                        promptVar.type = item.key as PromptVarType;
                        if (promptVar.type != 'struct') {
                            fieldRef.current = null;
                        }
                        sendRefreshSignal();
                    }}
                />
                <StringForm
                    name='변수명'
                    value={promptVar.name}
                    onChange={(name)=>{
                        promptVar.name = name;
                        sendRefreshSignal();
                    }}
                    width='10em'
                />
                <StringForm
                    name='표시되는 변수명'
                    value={promptVar.display_name}
                    onChange={(displayName)=>{
                        promptVar.display_name = displayName;
                        sendRefreshSignal();
                    }}
                    width='10em'
                />
                <Additions
                    promptVar={promptVar}
                    fieldVarRef={fieldRef}
                    onRefresh={sendRefreshSignal}
                />
            </ModalBox>
            {
                promptVar.type == 'struct' &&
                fieldRef.current != null &&
                <>
                    <div style={{width:'8px'}}/>
                    <ModalBox
                        className={styles['var-editor-modal']}
                        disappear={disappear}
                    >
                        <ModalHeader
                            title='필드 편집'
                            onClose={()=>{
                                fieldRef.current = null;
                                sendRefreshSignal();
                            }}
                        />
                        <DropdownForm
                            name='타입'
                            value={fieldRef.current.type}
                            items={FIELD_DROPDOWN_ITEMS}
                            onChange={(item)=>{
                                if (!fieldRef.current) return;
                                fieldRef.current.type = item.key as PromptVarType;
                                sendRefreshSignal();
                            }}
                        />
                        <StringForm
                            name='변수명'
                            value={fieldRef.current.name}
                            onChange={(name)=>{
                                if (!fieldRef.current) return;
                                fieldRef.current.name = name;
                                sendRefreshSignal();
                            }}
                            width='10em'
                        />
                        <StringForm
                            name='표시되는 변수명'
                            value={fieldRef.current.display_name}
                            onChange={(displayName)=>{
                                if (!fieldRef.current) return;
                                fieldRef.current.display_name = displayName;
                                sendRefreshSignal();
                            }}
                            width='10em'
                        />
                        <Additions
                            promptVar={fieldRef.current}
                            fieldVarRef={null}
                            onRefresh={sendRefreshSignal}
                        />
                    </ModalBox>
                </>
            }
        </Row>
    </ModalBackground>
    )
}

export default VarEditModal;