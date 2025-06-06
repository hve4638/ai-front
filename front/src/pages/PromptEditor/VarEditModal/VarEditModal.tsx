import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
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
import useModalDisappear from '@/hooks/useModalDisappear';
import useHotkey from '@/hooks/useHotkey';
import { useTranslation } from 'react-i18next';

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
    variables:PromptVar[];
    target:PromptVar;
    onRefresh?:()=>void;
    onClose:()=>void;
}

/**
 * PromptEditor 변수 편집 모달
 * 
 * @param param0 
 * @returns 
 */
function VarEditModal({
    variables,
    target : target,
    onRefresh = ()=>{},
    onClose
}:VarEditModalProps) {
    const { t } = useTranslation();
    const [disappear, close] = useModalDisappear(onClose);
    const [refreshSignal, refresh] = useSignal();
    const defaultValueCaches = useRef<{
        text?: string,
        number?: number,
        checkbox?: boolean,
        select?: string,
    }>({
        text: '',
        number: 0,
        checkbox: false,
    });

    const [warnVarNameDuplication, setWarnVarNameDuplication] = useState(false);
    
    const fieldRef = useRef<PromptVar|null>(null);

    useHotkey({
        'Escape': ()=>close(),
    });
    
    useLayoutEffect(()=>{
        onRefresh();
        initPromptVar(target);

        if (target.type != 'struct') {
            fieldRef.current = null;
        }
        else {
            initPromptVar(fieldRef.current);
        }
    }, [refreshSignal]);

    return (
    <ModalBackground
        disappear={disappear}
    >
        {
            // @TODO : 원래 ModalProvider에서 FocusLock을 제공해야 하지만 작동하지 않아 직접 추가
            // 추후 수정 필요
        }
        <FocusLock>
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
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap : '0.25em',
                }}

                disappear={disappear}
            >
                <ModalHeader onClose={close}>{t('form_editor.title')}</ModalHeader>
                <DropdownForm
                    name={t('form_editor.type_label')}
                    value={target.type}
                    items={VAR_DROPDOWN_ITEMS}
                    onChange={(item)=>{
                        if ('default_value' in target) {
                            defaultValueCaches.current[target.type] = target.default_value as any;
                        }
                        target.type = item.key as PromptVarType;

                        let defaultValue = (
                            target.type in defaultValueCaches.current
                                ? defaultValueCaches.current[target.type]
                                : null
                        );
                        (target as any).default_value = defaultValue;

                        if (target.type != 'struct') {
                            // 우측 필드 편집창 닫기
                            fieldRef.current = null;
                        }
                        refresh();
                    }}
                />
                <StringForm
                    name={t('form_editor.name_label')}
                    warn={
                        warnVarNameDuplication
                        ? '변수명이 중복되었습니다'
                        : undefined
                    }
                    
                    value={target.name}
                    onChange={(name)=>{
                        const filtered = variables.filter((item)=>item.name == name)
                        if (
                            filtered.length > 1
                            || (
                                filtered.length > 0 &&
                                filtered[0] !== target
                            )
                        ) {
                            setWarnVarNameDuplication(true);
                        }
                        else {
                            setWarnVarNameDuplication(false);
                            target.name = name;
                        }
                        refresh();
                    }}
                    width='10em'
                />
                <StringForm
                    style={{ marginTop : '0px' }}

                    name={t('form_editor.display_name_label')}
                    value={target.display_name}
                    onChange={(displayName)=>{
                        target.display_name = displayName;
                        refresh();
                    }}
                    width='10em'
                />
                <Additions
                    target={target}
                    fieldVarRef={fieldRef}
                    onRefresh={refresh}
                />
            </ModalBox>

            {
                (
                    target.type == 'struct'
                    || (target.type === 'array' && target.element?.type === 'struct')
                ) &&
                fieldRef.current != null &&
                <>
                    <div style={{width:'8px'}}/>
                    <ModalBox
                        className={styles['var-editor-modal']}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap : '0.25em',
                        }}
                        disappear={disappear}
                    >
                        <ModalHeader
                            onClose={()=>{
                                fieldRef.current = null;
                                refresh();
                            }}
                        >필드 편집</ModalHeader>
                        <DropdownForm
                            name='타입'
                            value={fieldRef.current.type}
                            items={FIELD_DROPDOWN_ITEMS}
                            onChange={(item)=>{
                                if (!fieldRef.current) return;
                                fieldRef.current.type = item.key as PromptVarType;
                                refresh();
                            }}
                        />
                        <StringForm
                            name='변수명'
                            value={fieldRef.current.name}
                            onChange={(name)=>{
                                if (!fieldRef.current) return;
                                fieldRef.current.name = name;
                                refresh();
                            }}
                            width='10em'
                        />
                        <StringForm
                            name='표시되는 변수명'
                            value={fieldRef.current.display_name}
                            onChange={(displayName)=>{
                                if (!fieldRef.current) return;
                                fieldRef.current.display_name = displayName;
                                refresh();
                            }}
                            width='10em'
                        />
                        <Additions
                            target={fieldRef.current}
                            fieldVarRef={null}
                            onRefresh={refresh}
                        />
                    </ModalBox>
                </>
            }
        </Row>
        </FocusLock>
    </ModalBackground>
    )
}

export default VarEditModal;