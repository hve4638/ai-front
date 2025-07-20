import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CheckBoxForm } from 'components/Forms';
import { Align, Center, Column, Flex, Row } from 'components/layout';
import CheckBox from 'components/CheckBox';
import { useCacheStore, useConfigStore, useDataStore, useProfileAPIStore } from '@/stores';
import ProviderListView from './ProviderListView';
import ModelListView from './ModelListView';
import useMemoryStore from '@/stores/useMemoryStore';
import CustomModelListView from './CustomModelListView';
import ProfileEvent from '@/features/profile-event';

function ModelOptions() {
    const { api } = useProfileAPIStore();
    const configs = useConfigStore();
    const caches = useCacheStore();
    const allModels = useMemoryStore(state => state.allModels);
    const [models, setModels] = useState<ChatAIModels>([]);
    const [providerIndex, setProviderIndex] = useState<number>(0);
    const previousOptions = useRef<any>({});

    const customeModelSelected = providerIndex === models.length;
    
    useEffect(() => {
        ProfileEvent.model.filter()
            .then(models => setModels(models));
    }, [
        allModels,
        caches.setting_models_show_featured,
        caches.setting_models_show_deprecated,
        caches.setting_models_show_experimental,
        caches.setting_models_show_snapshot
    ]);

    return (
        <div
            className='undraggable'
            style={{
                display: 'grid',
                gridTemplateRows: '1.2em 1fr 3em',
                gridTemplateColumns: '128px 1fr',
                width: '100%',
                height: '100%',
                gap: '3px',
            }}
        >
            <Row
                className='model-header'
                style={{
                    gridColumn: 'span 2',
                }}
            >
                <Flex />
                <ModelCheckBox
                    checked={caches.setting_models_show_featured}
                    onChange={(enabled) => {
                        if (enabled) {
                            previousOptions.current = {}
                            const prev = previousOptions.current;
                            prev['snapshot'] = caches.setting_models_show_snapshot;
                            prev['experimental'] = caches.setting_models_show_experimental;
                            prev['deprecated'] = caches.setting_models_show_deprecated;

                            caches.update.setting_models_show_featured(enabled);
                            caches.update.setting_models_show_snapshot(false);
                            caches.update.setting_models_show_experimental(false);
                            caches.update.setting_models_show_deprecated(false);
                        }
                        else {
                            const prev = previousOptions.current;

                            caches.update.setting_models_show_featured(enabled);
                            caches.update.setting_models_show_snapshot(prev['snapshot'] ?? false);
                            caches.update.setting_models_show_experimental(prev['experimental'] ?? false);
                            caches.update.setting_models_show_deprecated(prev['deprecated'] ?? false);
                        }
                    }}
                >주 모델만</ModelCheckBox>
                <div style={{ width: '8px' }} />
                <ModelCheckBox
                    checked={caches.setting_models_show_snapshot}
                    onChange={(value) => {
                        caches.update.setting_models_show_featured(false);
                        caches.update.setting_models_show_snapshot(value);
                    }}
                >스냅샷</ModelCheckBox>
                <div style={{ width: '8px' }} />
                <div style={{ width: '8px' }} />
                <ModelCheckBox
                    checked={caches.setting_models_show_deprecated}
                    onChange={(value) => {
                        caches.update.setting_models_show_featured(false);
                        caches.update.setting_models_show_deprecated(value);
                    }}
                >비권장</ModelCheckBox>
            </Row>
            <ProviderListView
                models={models}
                selected={providerIndex}
                onChange={(index) => setProviderIndex(index)}
            />
            {
                customeModelSelected &&
                <CustomModelListView
                    onClick={async (model) => {
                        if (ProfileEvent.model.isStarred(model.id)) {
                            await ProfileEvent.model.unstar(model.id);
                        }
                        else {
                            await ProfileEvent.model.star(model.id);
                        }
                    }}
                />
            }
            {
                !customeModelSelected &&
                <ModelListView
                    provider={models[providerIndex]}

                    onClick={async (model) => {
                        if (ProfileEvent.model.isStarred(model.id)) {
                            await ProfileEvent.model.unstar(model.id);
                        }
                        else {
                            await ProfileEvent.model.star(model.id);
                        }
                    }}
                />
            }
            <div
                style={{
                    display: 'block',
                    gridColumn: 'span 2',
                    height: '1.5em',
                    fontSize: '0.85em',
                }}
            >
                <CheckBoxForm
                    name='관심 모델만 모델 목록에 표시'
                    style={{
                        width: '100%',
                        margin: '0px',
                        height: '100%',
                    }}
                    checked={configs.only_starred_models}
                    onChange={(value) => configs.update.only_starred_models(value)}
                />
                <CheckBoxForm
                    name='모델의 실제 명칭 표시'
                    style={{
                        width: '100%',
                        margin: '0px',
                        height: '100%',
                    }}
                    checked={configs.show_actual_model_name}
                    onChange={(value) => configs.update.show_actual_model_name(value)}
                />
            </div>
        </div>
    )
}

function ModelCheckBox({
    children = <></>, checked, onChange
}: {
    children?: React.ReactNode;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <>
            <span>{children}</span>
            <CheckBox
                style={{
                    height: '100%',
                    marginLeft: '2px',
                    padding: '0.25em',
                    aspectRatio: '1/1',
                }}
                checked={checked}
                onChange={(value) => onChange(value)}
            />
        </>
    )
}

export default ModelOptions; 