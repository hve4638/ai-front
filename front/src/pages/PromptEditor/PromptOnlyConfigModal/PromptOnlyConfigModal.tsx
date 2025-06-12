import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBackground, ModalBox, ModalHeader } from '@/components/Modal';
import { DropdownForm, NumberForm, StringForm } from '@/components/Forms';

import useSignal from 'hooks/useSignal';
import styles from './styles.module.scss';
import { Column, Row } from '@/components/layout';
import useModalDisappear from '@/hooks/useModalDisappear';
import useHotkey from '@/hooks/useHotkey';
import { PromptEditorData, PromptInputType } from '@/types';
import { use } from 'i18next';
import Delimiter from '@/components/Delimiter';

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
    });

    return (
        <Modal
            disappear={disappear}
        >
            <ModalHeader onClose={close}>{'설정'}</ModalHeader>
            <Column
                style={{
                    padding: '0.5em 0em 0.5em 0.5em',
                    gap: '0.5em',
                }}
            >
                <b className='undraggable'>메타데이터</b>
                <Delimiter/>
                <StringForm
                    name='템플릿 이름'
                    value={data.name ?? ''}
                    onChange={(value)=>{
                        data.name = value;
                        data.changed.name = true;
                        refresh();
                    }}
                />
                <StringForm
                    name='버전'
                    value={data.version}
                    onChange={(value)=>{
                        data.version = value;
                        data.changed.version = true;
                        refresh();
                    }}
                />
                <div style={{height: '0.5em'}}/>
                <b className='undraggable'>입력</b>
                <Delimiter/>
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
                <div style={{height: '0.5em'}}/>
                <b className='undraggable'>모델</b>
                <Delimiter/>
                <NumberForm
                    name='최대 응답 크기'
                    value={data.model.maxTokens}
                    onChange={(value)=>{
                        data.model.maxTokens = value;
                        data.changed.model = true;
                        refresh();
                    }}
                />
                <NumberForm
                    name='온도'
                    value={data.model.temperature}
                    onChange={(value)=>{
                        data.model.temperature = value;
                        data.changed.model = true;
                        refresh();
                    }}
                />
                <NumberForm
                    name='Top P'
                    value={data.model.topP}
                    onChange={(value)=>{
                        data.model.topP = value;
                        data.changed.model = true;
                        refresh();
                    }}
                />
                {/* <NumberForm
                    name='생각 토큰 크기'
                    value={0}
                    onChange={(value)=>{
                        console.log(value);
                        refresh();
                    }}
                />
                <NumberForm
                    name='이전 대화 컨텍스트 크기'
                    value={0}
                    onChange={(value)=>{
                        console.log(value);
                        refresh();
                    }}
                /> */}
            </Column>

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