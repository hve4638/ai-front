import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ProfileContext, RawProfileSessionContext, useContextForce } from 'context';
import styles from '../styles.module.scss';

import LocalAPI from 'api/local';
import { Align, Flex, Row } from 'components/layout';
import Dropdown, { DropdownItem, DropdownItemList } from 'components/Dropdown';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import {
    OpenAIIcon,
    GoogleIcon,
    AnthropicIcon,
    GoogleVertexAIIcon,
} from 'components/Icons'
import AddPromptModal from '../AddPromptModal';
import { useTranslation } from 'react-i18next';
import { mapRTMetadataTree } from 'utils/rt';
import AvatarPopover from '../AvatarPopover';
import RTEditModal from '../RTEditModal';
import { useModals } from 'hooks/useModals';
import SettingModal from 'pages/SettingModal';


const CREATE_NEW_PROMPT = 'CREATE_NEW_PROMPT';

function Header() {
    const navigate = useNavigate();
    const modals = useModals();
    const { t } = useTranslation();
    const profileContext = useContextForce(ProfileContext);
    const sessionContext = useContextForce(RawProfileSessionContext);
    const {
        starredModels,
        isModelStarred,
        configs,
    } = profileContext;
    const {
        modelKey, setModelKey
    } = sessionContext;
    const [allModles, setAllModels] = useState<ChatAIModels>([]);
    const [models, setModels] = useState<DropdownItemList[]>([]);

    const [showAvatarPopover, setShowAvatarPopover] = useState(false);

    // 요청 템플릿
    const [rtMetadataTree, setRTMetadataTree] = useState<RTMetadataTree>([]);
    const [rtDropdownItems, setRTDropdownItems] = useState<(DropdownItem|DropdownItemList)[]>([]);
    const [rtDropdownSelected, setRTDropdownSelected] = useState<string>('');
    

    const renderPromptName = useCallback((item: DropdownItem|DropdownItemList, parentList?: DropdownItemList|undefined)=>{
        let prefixIcon = <></>
        if ('key' in item && item.key === CREATE_NEW_PROMPT) {
            prefixIcon = <GoogleFontIcon value='add' style={{marginRight:'4px'}}/>
        }
        
        return (<>
            {prefixIcon}
            <span>{item.name}</span>
        </>);
    }, []);

    const renderModelName = useCallback((item: DropdownItem|DropdownItemList, parentList?: DropdownItemList|undefined)=>{
        let prefixIcon = <></>
        if (!parentList && 'list' in item) {
            switch (item.name) {
                case 'Google':
                    prefixIcon = <GoogleIcon style={{marginRight:'8px'}}/>
                    break;
                case 'Anthropic':
                    prefixIcon = <AnthropicIcon style={{marginRight:'8px'}}/>
                    break;
                case 'OpenAI':
                    prefixIcon = <OpenAIIcon style={{marginRight:'8px'}}/>
                    break;
                case 'VertexAI':
                    prefixIcon = <GoogleVertexAIIcon style={{marginRight:'8px'}}/>
                    break;
                default:
                    break;
            }
        }

        return (
            <>
                {prefixIcon}
                <span>{item.name}</span>
            </>
        )
    }, []);

    const renderSelectedModelName = useCallback((item: DropdownItem, parentList?: DropdownItemList|undefined)=>{
        let prefixIcon = <></>
        switch (parentList?.name) {
            case 'Google':
                prefixIcon = <GoogleIcon style={{marginRight:'8px'}}/>
                break;
            case 'Anthropic':
                prefixIcon = <AnthropicIcon style={{marginRight:'8px'}}/>
                break;
            case 'OpenAI':
                prefixIcon = <OpenAIIcon style={{marginRight:'8px'}}/>
                break;
            case 'VertexAI':
                prefixIcon = <GoogleVertexAIIcon style={{marginRight:'8px'}}/>
                break;
            default:
                break;
        }

        return (
            <>
                {prefixIcon}
                <span>{item.name}</span>
            </>
        )
    }, []);

    useEffect(()=>{
        // @TODO : LocalAPI를 직접 호출해서는 안됨
        // 추후 ProfileContext를 통해서 호출하도록 변경 필요
        LocalAPI.getChatAIModels()
            .then((models)=>{
                setAllModels(models);
                console.log(models);
            });
        profileContext.getRTTree()
            .then((tree)=>{
                setRTMetadataTree(tree);
            });
    }, []);

    // 요청 템플릿 드롭다운 갱신
    useLayoutEffect(()=>{
        const items = mapRTMetadataTree<DropdownItem, DropdownItemList>(rtMetadataTree, {
            mapDirectory : (item, children)=>{
                return {
                    name: item.name,
                    list: children,
                };
            },
            mapNode : (item)=>({
                name: item.name,
                key: item.id,

            }),
        });
        setRTDropdownItems(items);
    }, [rtMetadataTree]);

    // 모델 드롭다운 갱신
    useLayoutEffect(()=>{
        const nextModels:DropdownItemList[] = [];

        allModles.forEach((provider)=>{
            const nextProvider:DropdownItemList = {
                name: provider.name,
                list: [],
            };
            provider.list.forEach((category:ChatAIMoedelCategory)=>{
                category.list.forEach((model:ChatAIModel)=>{
                    if (!configs.onlyStarredModels || isModelStarred(model.id)) {
                        nextProvider.list.push({
                            name: configs.showActualModelName ? model.value : model.name,
                            key: model.id,
                        });
                    }
                });
            });

            if (nextProvider.list.length > 0) {
                nextModels.push(nextProvider);
            }
        })

        setModels(nextModels);
    }, [
        allModles,
        starredModels,
        configs.onlyStarredModels,
        configs.showActualModelName
    ]);

    return (
        <header
            id='app-header'
            style={{
                // margin: '0px 16px 0px 16px',
                padding: '8px 8px 0px 8px',
                height: '40px',
                fontSize: '16px',
            }}
        >
            <Flex
                style={{
                    margin: '0px 8px',
                }}
            >
                <Dropdown
                    style={{
                        minWidth: '48px',
                    }}
                    renderItem={renderModelName}
                    renderSelectedItem={renderSelectedModelName}
                    items={models}
                    value={modelKey}
                    onChange={(item)=>{
                        setModelKey(item.key);
                    }}
                    onItemNotFound={()=>{
                        if (models.length === 0) return;

                        setModelKey(models[0].list[0].key);
                    }}
                />
                <Flex/>
                
                <Dropdown
                    style={{
                        minWidth: '48px',
                    }}
                    items={[
                        ...rtDropdownItems,
                        {
                            name: t('rt.new-rt'),
                            key : CREATE_NEW_PROMPT,
                        }
                    ]}
                    value={rtDropdownSelected}
                    renderItem={renderPromptName}
                    onChange={(item)=>{
                        modals.open(AddPromptModal, {
                            onAddPrompt: (type:any) => {
                                navigate('/prompts/new');
                            }
                        });
                    }}
                    onItemNotFound={()=>{
                        if (rtDropdownItems.length === 0) return;
                        else if ('key' in rtDropdownItems[0]) {
                            setRTDropdownSelected(rtDropdownItems[0].key);
                        }
                        else  if ('list' in rtDropdownItems[0]) {
                            setRTDropdownSelected(rtDropdownItems[0].list[0].key);
                        }
                    }}
                />
            </Flex>
            
            <Flex
                style={{
                    margin: '0px 8px',
                }}
            >
                <Row
                    className='flex'
                    columnAlign={Align.Center}
                    
                >
                    <Flex/>
                    {/* 변수 */}
                    {/* 에러 */}
                    {/* 기록 */}
                    <div className={styles['avatar-container']}>
                        <label
                            className={styles['avatar-label']}
                            onClick={()=>{
                                setShowAvatarPopover(prev=>!prev);
                            }}
                        >
                            <div
                                className={styles['avatar']}
                            />
                        </label>
                        {
                            showAvatarPopover &&
                            <AvatarPopover
                                onClickEditRequestTemplate={()=>{
                                    modals.open(RTEditModal, {
                                        onClickCreateNewRT:()=>{
                                            // @TODO
                                        }
                                    });
                                    setShowAvatarPopover(false);
                                }}
                                onClickSetting={()=>{
                                    modals.open(SettingModal, {});

                                    setShowAvatarPopover(false);
                                }}
                                onClickChangeProfile={()=>{
                                    // @TODO
                                }}

                                onClickOutside={(e)=>setShowAvatarPopover(false)}
                            />
                        }
                    </div>
                </Row>
            </Flex>
        </header>
    );
}

export default Header;