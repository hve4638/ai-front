import { useEffect, useMemo, useState } from 'react';

import LocalAPI from 'api/local';
import Dropdown, { DropdownItem, DropdownItemList } from 'components/Dropdown';
import {
    OpenAIIcon,
    GoogleIcon,
    AnthropicIcon,
    GoogleVertexAIIcon,
} from 'components/Icons'
import { useConfigStore, useDataStore, useProfileAPIStore, useProfileEvent, useSessionStore } from '@/stores';

function ModelDropdown() {
    const { api } = useProfileAPIStore();
    const only_starred_models = useConfigStore(state=>state.only_starred_models);
    const show_actual_model_name = useConfigStore(state=>state.show_actual_model_name);
    const starred_models = useDataStore(state=>state.starred_models);
    const model_id = useSessionStore(state=>state.model_id);
    const updateSessionState = useSessionStore(state=>state.update);
    const { isModelStarred } = useProfileEvent();

    const [allModles, setAllModels] = useState<ChatAIModels>([]);
    const dropdownItems:DropdownItemList[] = useMemo(()=>{
        const nextModels:DropdownItemList[] = [];

        allModles.forEach((provider)=>{
            const nextProvider:DropdownItemList = {
                name: provider.name,
                list: [],
            };
            provider.list.forEach((category:ChatAIMoedelCategory)=>{
                category.list.forEach((model:ChatAIModel)=>{
                    if (!only_starred_models || isModelStarred(model.id)) {
                        nextProvider.list.push({
                            name: show_actual_model_name ? model.name : model.displayName,
                            key: model.id,
                        });
                    }
                });
            });

            if (nextProvider.list.length > 0) {
                nextModels.push(nextProvider);
            }
        });

        return nextModels;
    }, [
        allModles,
        starred_models,
        only_starred_models,
        show_actual_model_name
    ])

    useEffect(()=>{
        api.getChatAIModels()
            .then((models)=>{
                setAllModels(models);
            });
    }, []);


    return (  
        <Dropdown
            style={{
                minWidth: '48px',
            }}
            renderItem={renderModelDropdownItem}
            renderSelectedItem={renderSelectedModelName}
            items={dropdownItems}
            value={model_id}
            onChange={(item)=>{
                updateSessionState.model_id(item.key);
            }}
            onItemNotFound={()=>{
                if (dropdownItems.length === 0) return;

                updateSessionState.model_id(dropdownItems[0].list[0].key);
            }}
        />
    )
}

function renderIcon(providerName?:string) {
    switch (providerName) {
        case 'Google':
            return <GoogleIcon style={{marginRight:'8px'}}/>
        case 'Anthropic':
            return <AnthropicIcon style={{marginRight:'8px'}}/>
        case 'OpenAI':
            return <OpenAIIcon style={{marginRight:'8px'}}/>
        case 'VertexAI':
            return <GoogleVertexAIIcon style={{marginRight:'8px'}}/>
        default:
            return <></>
    }
}

function renderModelDropdownItem(item: DropdownItem|DropdownItemList, parentList?: DropdownItemList|undefined) {
    let prefixIcon = <></>
    if (!parentList && 'list' in item) {
        prefixIcon = renderIcon(item.name);
    }

    return (
        <>
            {prefixIcon}
            <span>{item.name}</span>
        </>
    )
}

function renderSelectedModelName(item: DropdownItem, parentList?: DropdownItemList|undefined) {
    return (
        <>
            {renderIcon(parentList?.name)}
            <span>{item.name}</span>
        </>
    )
}

export default ModelDropdown;