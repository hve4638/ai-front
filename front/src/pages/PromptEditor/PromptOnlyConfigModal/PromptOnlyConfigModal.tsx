import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBackground, ModalBox, ModalHeader } from 'components/Modal';
import { DropdownForm, StringForm } from 'components/Forms';

import useSignal from 'hooks/useSignal';
import styles from './styles.module.scss';
import { Row } from 'components/layout';
import useModalDisappear from '@/hooks/useModalDisappear';
import useHotkey from '@/hooks/useHotkey';
import { PromptEditorData, PromptInputType } from '@/types';
import { use } from 'i18next';

type PromptOnlyConfigModalProps = {
    data:PromptEditorData;
    onRefresh?:()=>void;
    onClose:()=>void;
}

function PromptOnlyConfigModal({
    data,
    onRefresh = ()=>{},
    onClose
}:PromptOnlyConfigModalProps) {
    const { t } = useTranslation();
    const [disappear, close] = useModalDisappear(onClose);
    const [_, refreshSignal] = useSignal();

    const refresh = () => {
        data.changed.config = true;
        refreshSignal();
        onRefresh();
    }

    useHotkey({
        'Escape' : () => {
            close();
            return true;
        }
    })

    return (
        <Modal
            disappear={disappear}
        >
            <ModalHeader onClose={close}>{'설정'}</ModalHeader>
            {/* <b>요청 템플릿</b>
            <div style={{ height: '0.25em' }}/> */}
            {/* <hr/> */}
            <div
                style={{ padding: '0.5em 0em 0.5em 0.5em' }}
            >
                <DropdownForm
                    name='입력 레이아웃'
                    value={data.config.inputType}
                    onChange={(item)=>{
                        console.log(item);
                        data.config.inputType = item.key as PromptInputType;
                        refresh();
                    }}
                    items={[
                        { name: '일반', key: 'normal' },
                        { name: '채팅', key: 'chat' },
                    ]}
                />
            </div>

            {/* <hr/>
            <b>모델 제한</b>
            <div>제한 없음</div>
            <div>프로바이더 제한</div>
            <div>특정 모델만</div>
             */}
            {/*
            <StringForm
                name={'hi'}
                value={currentName}
                onChange={setCurrentName}
                width='18em'
            />
            */}
        </Modal>
    )
}

export default PromptOnlyConfigModal;