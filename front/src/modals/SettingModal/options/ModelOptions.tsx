import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CheckBoxForm } from 'components/Forms';
import { Align, Center, Column, Flex, Row } from 'components/layout';
import LocalAPI from 'api/local';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import CheckBox from 'components/CheckBox';
import { useCacheStore, useConfigStore, useDataStore, useProfileAPIStore, useProfileEvent } from '@/stores';

function ModelOptions() {
    const { api } = useProfileAPIStore();
    const configs = useConfigStore();
    const caches = useCacheStore();
    const starred_models = useDataStore(state=>state.starred_models);
    const {
        isModelStarred,
        starModel,
        unstarModel,
    } = useProfileEvent();

    const [allModels, setAllModels] = useState<ChatAIModels>([]);
    const [models, setModels] = useState<ChatAIModels>([]);
    const [selectedProviderIndex, setSelectedProviderIndex] = useState<number>(0);
    const [modelUnfold, setModelUnfold] = useState<boolean[]>([]);
    const previousOptions = useRef<any>({});

    useEffect(()=>{
        api.getChatAIModels()
            .then((models)=>{
                setAllModels(models);
            });
    }, []);

    useLayoutEffect(()=>{
        const newProviders:ChatAIModelProviders[] = [];
        for (const provider of allModels) {
            const newProvider:ChatAIModelProviders = {
                name: provider.name,
                list: [],
            };
            newProviders.push(newProvider);

            provider.list.forEach((category, index)=>{
                const newModels:ChatAIModel[] = [];
                
                category.list.forEach((model)=>{
                    if (model.flags.featured) {
                        newModels.push(model);
                        return;
                    }
                    // '주 모델만' 활성화 시 featured 모델만 표시
                    if (caches.setting_models_show_featured) {
                        return;
                    }
                     // '스냅샷', '실험적', '비권장'이 아니라면 표시 
                    else if (
                        !model.flags.snapshot &&
                        !model.flags.experimental &&
                        !model.flags.deprecated &&
                        !model.flags.legacy
                    ) {
                        newModels.push(model);
                    }
                    // '비권장' 우선 확인
                    // '비권장' 태그가 있으면 다른 태그 조건이 있어도 표시하지 않음
                    else if (
                        (!caches.setting_models_show_deprecated) && 
                        (model.flags.deprecated || model.flags.legacy)
                    ) {
                        return;
                    }
                    // 옵션 체크
                    else if (
                        (model.flags.snapshot && caches.setting_models_show_snapshot) ||
                        (model.flags.experimental && caches.setting_models_show_experimental) ||
                        (model.flags.deprecated && caches.setting_models_show_deprecated) ||
                        (model.flags.legacy && caches.setting_models_show_deprecated)
                    ) {
                        newModels.push(model);
                    }
                });

                const newCategory:ChatAIMoedelCategory = {
                    name: category.name,
                    list: newModels,
                };
                newProvider.list.push(newCategory);
            });
        }
        setModels(newProviders);
    }, [
        allModels,
        caches.setting_models_show_featured,
        caches.setting_models_show_deprecated,
        caches.setting_models_show_experimental,
        caches.setting_models_show_snapshot
    ]);

    useLayoutEffect(()=>{
        if (models == null) return;
        if (models[selectedProviderIndex] == null) return;

        setModelUnfold(models.map(()=>false));
    }, [selectedProviderIndex]);
    
    return (
        <div
            className='undraggable'
            style={{
                display: 'grid',
                gridTemplateRows : '1.2em 1fr 3em',
                gridTemplateColumns : '128px 1fr',
                width: '100%',
                height: '100%',
            }}
        >
            <Row
                className='model-header'
                style={{
                    gridColumn: 'span 2',
                }}
            >
                <span>모델</span>
                <Flex/>
                <ModelCheckBox
                    checked={caches.setting_models_show_featured}
                    onChange={(enabled)=>{
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
                <div style={{width:'8px'}}/>
                <ModelCheckBox
                    checked={caches.setting_models_show_snapshot}
                    onChange={(value)=>{
                        caches.update.setting_models_show_featured(false);
                        caches.update.setting_models_show_snapshot(value);
                    }}
                >스냅샷</ModelCheckBox>
                <div style={{width:'8px'}}/>
                <ModelCheckBox
                    checked={caches.setting_models_show_experimental}
                    onChange={(value)=>{
                        caches.update.setting_models_show_featured(false);
                        caches.update.setting_models_show_experimental(value);
                    }}
                >실험적</ModelCheckBox>
                <div style={{width:'8px'}}/>
                <ModelCheckBox
                    checked={caches.setting_models_show_deprecated}
                    onChange={(value)=>{
                        caches.update.setting_models_show_featured(false);
                        caches.update.setting_models_show_deprecated(value);
                    }}
                >비권장</ModelCheckBox>
            </Row>
            <Column
                className='model-list'
                style={{
                    fontSize: '0.85em',
                    padding : '4px 4px',
                    minHeight: '100%',
                }}
            >
                {
                    models.map((provider, index) => (
                        <>
                            <div
                                key={provider.name + index}
                                className={
                                    'provider' +
                                    (selectedProviderIndex === index ? ' selected' : '')
                                }
                                style={{
                                    cursor: 'pointer',
                                }}
                                onClick={()=>{
                                    setSelectedProviderIndex(index);
                                }}
                            >
                                {provider.name}
                            </div>
                            {
                                index !== models.length - 1 &&
                                <hr key={provider.name + 'hr'}/>
                            }
                        </>
                    ))
                }
            </Column>
            <div
                className='model-list'
                style={{
                    display: 'block',
                    fontSize: '0.85em',
                    padding : '4px 4px',
                    overflowY: 'auto',
                }}
            >
                {
                    models != null &&
                    models[selectedProviderIndex] != null &&
                    models[selectedProviderIndex].list.map((model, index) => {
                        if (model.list == null) return <></>;
                        if (model.list.length === 0) return <></>;

                        return (<>
                            <Row
                                key={model.name + index}
                                className={
                                    'model'
                                    + (modelUnfold[index] ? ' unfold' : '')
                                }
                                onClick={()=>{
                                    setModelUnfold((prev)=>{
                                        const next = [...prev];
                                        next[index] = !next[index];
                                        return next;
                                    })
                                }}
                            >
                                <span>{model.name}</span>
                                <Flex/>
                            </Row>
                            {
                                modelUnfold[index] &&
                                model.list.map((option:ChatAIModel, index) => (
                                    <Row
                                        key={model.name + index + option.name}
                                        className='model-option'
                                        onRClick={(e)=>{
                                            if (isModelStarred(option.id)) {
                                                unstarModel(option.id);
                                            }
                                            else {
                                                starModel(option.id);
                                            }
                                        }}
                                    >
                                        <Row
                                            key={option.name + index}
                                            style={{
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <span
                                                className='noflex'
                                            >
                                                {
                                                    configs.show_actual_model_name
                                                    ? option.name
                                                    : option.displayName
                                                }
                                            </span>
                                            {
                                                !!option.flags.snapshot &&
                                                <Tag>snapshot</Tag>
                                            }
                                            {
                                                !!option.flags.experimental &&
                                                <Tag>experimental</Tag>
                                            }
                                            {
                                                !!option.flags.deprecated &&
                                                <Tag>deprecated</Tag>
                                            }
                                            {
                                                !!option.flags.legacy &&
                                                <Tag>legacy</Tag>
                                            }
                                        </Row>
                                        <Flex/>
                                        <GoogleFontIcon
                                            className={
                                                'star'
                                                + (isModelStarred(option.id) ? ' starred' : '')
                                            }
                                            value='star'
                                            style={{
                                                margin: 'auto 0px',
                                                marginRight : '5px',
                                                cursor: 'pointer',
                                                fontSize: '1.2em',
                                            }}
                                            onClick={()=>{
                                                if (isModelStarred(option.id)) {
                                                    unstarModel(option.id);
                                                }
                                                else {
                                                    starModel(option.id);
                                                }
                                            }}
                                            enableHoverEffect={true}
                                        />
                                    </Row>
                                ))
                            }
                            {
                                index !== models[selectedProviderIndex].list.length - 1 &&
                                <hr/>
                            }
                        </>)
                    })
                }
            </div>
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
                        width : '100%',
                        margin: '0px',
                        height: '100%',
                    }}
                    checked={configs.only_starred_models}
                    onChange={(value)=>configs.update.only_starred_models(value)}
                />
                <CheckBoxForm
                    name='모델의 실제 명칭 표시'
                    style={{
                        width : '100%',
                        margin: '0px',
                        height: '100%',
                    }}
                    checked={configs.show_actual_model_name}
                    onChange={(value)=>configs.update.show_actual_model_name(value)}
                />
            </div>
        </div>
    )
}

function Tag({children}:{children:React.ReactNode}) {
    return (
        <div
            className='tag-container'
            style={{
                display: 'flex',
                flexShrink: 1,
                flexBasis: 'auto',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}
        >
            <span className='tag'>
                {children}
            </span>
        </div>
    )
}

function ModelCheckBox({
    children=<></>, checked, onChange
}: {
    children?:React.ReactNode;
    checked:boolean;
    onChange:(value:boolean)=>void;
}) {
    return (
        <>
            <span>{children}</span>
            <Center
                style={{
                    height: '100%',
                    marginLeft: '2px',
                    padding: '0.25em',
                    aspectRatio: '1/1',
                }}
            >
                <input
                    type='checkbox'
                    style={{
                        height: '100%',
                        aspectRatio: '1/1',
                    }}
                    checked={checked}
                    onChange={(e)=>onChange(e.target.checked)}
                    tabIndex={0}
                />
            </Center>
            {/* <CheckBox
                style={{
                    fontSize : '0.9em',
                    width: '0.9em',
                    height: '100%',
                    margin : '0px 4px',
                }}
                checked={checked}
                onChange={onChange}
            /> */}
        </>
    )
}

export default ModelOptions; 