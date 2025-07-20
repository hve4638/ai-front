import Button from '@/components/Button';
import Delimiter from '@/components/Delimiter';
import Dropdown from '@/components/Dropdown';
import { CheckBoxForm, NumberForm } from '@/components/Forms';
import SliderForm from '@/components/Forms/SliderForm';
import { Column, Flex, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/Modal';
import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';
import { useCacheStore } from '@/stores';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { safetyFilterThresholdMap, safetyFilterThresholdMapReverse } from './data';
import ProfileEvent from '@/features/profile-event';
import useSignal from '@/hooks/useSignal';
import { CommonOptions, SafetyOptions, ThinkingOptions } from './options';

type ModelConfigModalProps = {
    modelId: string;
    isFocused: boolean;
    onClose: () => void;
}

function ModelConfigModal({
    modelId,
    isFocused,
    onClose = () => { },
}: ModelConfigModalProps) {
    const { t } = useTranslation();
    const [disappear, closed] = useModalDisappear(onClose);
    const configRef = useRef<Partial<ModelConfiguration>>({});
    const [refreshPing, refresh] = useSignal();
    const modelName = useMemo(() => {
        return ProfileEvent.model.getName(modelId);
    }, [modelId]);

    const close = () => {
        ProfileEvent.model.setGlobalConfig(modelId, configRef.current);
        closed();
    }

    useEffect(() => {
        ProfileEvent.model.getGlobalConfig(modelId)
            .then((data) => {
                configRef.current = data;
                refresh();
            });
    }, [modelId]);

    useHotkey({
        'Escape': close,
    }, isFocused, []);

    const config = configRef.current ?? {};
    const safetySettings = config?.safety_settings ?? {};

    return (
        <Modal
            disappear={disappear}
            style={{
                maxHeight: '80%',
                // overflowY: 'auto',
            }}
            headerLabel={
                <ModalHeader
                    onClose={close}
                    children={'모델 설정: ' + modelName}
                />
            }
        >
            <Column
                style={{
                    gap: '0.3em',
                }}
            >
                <CheckBoxForm
                    label={'설정 덮어쓰기 활성화'}
                    checked={config.override_enabled ?? false}
                    onChange={(next) => {
                        config.override_enabled = next;
                        refresh();
                    }}
                />
                <small className='secondary-color' style={{ paddingLeft: '0.25em' }}>활성화 시 요청 템플릿 내 설정보다 이 옵션을 우선합니다.</small>
                <div style={{ height: '0.5em' }} />
                <CommonOptions
                    config={config}
                    refresh={refresh}
                />
                <div style={{ height: '1em' }} />
                <ThinkingOptions
                    config={config}
                    refresh={refresh}
                />
                <div style={{ height: '1em' }} />
                <SafetyOptions
                    config={config}
                    refresh={refresh}
                />

            </Column>
        </Modal>
    )
}

export default ModelConfigModal;