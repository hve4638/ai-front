import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import LocalAPI from 'api/local';
import { Align, Flex, Row } from 'components/layout';
import { ProfileContext, RawProfileSessionContext, useContextForce } from 'context';
import Dropdown, { DropdownItem, DropdownItemList } from 'components/Dropdown';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import {
    OpenAIIcon,
    GoogleIcon,
    AnthropicIcon,
    GoogleVertexAIIcon,
} from 'components/Icons'
import AddPromptModal from './AddPromptModal';
import { PageType } from './types';

type HeaderProps = {
    onEnableSetting: () => void;
    onChangePage: (pageType: PageType) => void;
}

const CREATE_NEW_PROMPT = 'CREATE_NEW_PROMPT';

function Header({
    onEnableSetting,
    onChangePage
}:HeaderProps) {
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
    const [showAddPromptModal, setShowAddPromptModal] = useState(false);

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
        LocalAPI.getChatAIModels()
            .then((models)=>{
                setAllModels(models);
                console.log(models);
            });
    }, []);

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
            {
                showAddPromptModal &&
                <AddPromptModal
                    onAddPrompt={(type:any)=>{
                        onChangePage(PageType.PROMPT_EDITOR);
                    }}
                    onClose={()=>{
                        setShowAddPromptModal(false);
                    }}
                />
            }
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
                        {
                            name: '프롬프트 생성',
                            key : CREATE_NEW_PROMPT,
                        }
                    ]}
                    value={''}
                    renderItem={renderPromptName}
                    onChange={(item)=>{
                        if (item.key === CREATE_NEW_PROMPT) {
                            setShowAddPromptModal(true);
                        }
                    }}
                    onItemNotFound={()=>{

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
                    <GoogleFontIcon
                        enableHoverEffect={true}
                        value='settings'
                        style={{
                            fontSize: '24px',
                            cursor: 'pointer',
                        }}
                        onClick={ ()=>onEnableSetting() }
                    />
                    {/* 프로필 */}
                </Row>
            </Flex>
        </header>
    );
}

export default Header;