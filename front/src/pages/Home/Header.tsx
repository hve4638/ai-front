import { useEffect, useLayoutEffect, useState } from 'react';
import LocalAPI from 'api/local';
import { Align, Flex, Row } from 'lib/flex-widget';
import { ProfileContext, RawProfileSessionContext, useContextForce } from 'context';
import Dropdown, { DropdownItem, DropdownItemList } from 'components/Dropdown';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import {
    OpenAIIcon,
    GoogleIcon,
    AnthropicIcon,
    GoogleVertexAIIcon,
} from 'components/Icons'

type HeaderProps = {
    onEnableSetting: () => void;
}

function Header({
    onEnableSetting,
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
    const [select, setSelect] = useState<string>('1');
    const [allModles, setAllModels] = useState<ChatAIModels>([]);
    const [models, setModels] = useState<DropdownItemList[]>([]);

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
            id="app-header"
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

                    renderSelectedItem={(item, itemList)=>{
                        let prefixIcon = <></>
                        switch (itemList?.name) {
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
                    }}
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
                            name: '+ 프롬프트 생성',
                            key : '1'
                        }
                    ]}
                    value={''}
                    onChange={(item)=>{

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