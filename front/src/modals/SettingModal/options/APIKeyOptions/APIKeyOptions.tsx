import { useMemo, useState } from 'react';
import DivButton from 'components/DivButton';
import { useModal } from 'hooks/useModal';
import StringInputModal from 'modals/StringInputModal';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { Align, Flex, Row } from 'components/layout';
import Dropdown from 'components/Dropdown';
import { APIKeyMetadata } from 'types/apikey-metadata';
import { useDataStore, useProfileEvent } from '@/stores';
import AddAPIKeyButton from './AddAPIKeyButton';
import APIItem from './APIItem';
import VertexAIKeySection from './VertexAIKeySection';


function APIKeyOptions() {
    const { api_keys } = useDataStore();

    const {
        openAIAPIs,
        anthropicAPIs,
        googleAPIs,
        vertexAIAPIs
    } = useMemo(()=>{
        return {
            openAIAPIs: api_keys['openai'] ?? [],
            anthropicAPIs: api_keys['anthropic'] ?? [],
            googleAPIs: api_keys['google'] ?? [],
            vertexAIAPIs: api_keys['vertexai'] ?? []
        };
    }, [api_keys]);

    return (
        <>
            <SingleAPIKeySection
                title='OpenAI'
                provider='openai'
                addButtonText='OpenAI API 키'
                apiKeys={openAIAPIs}
            />
            <div style={{ height: '1em' }} />
            <SingleAPIKeySection
                title='Anthropic Claude'
                provider='anthropic'
                addButtonText='Anthropic API 키'
                apiKeys={anthropicAPIs}
            />
            <div style={{ height: '1em' }} />
            <SingleAPIKeySection
                title='Google Gemini'
                provider='google'
                addButtonText='Google API 키'
                apiKeys={googleAPIs}
            />
            <div style={{ height: '1em' }} />
            <VertexAIKeySection
                title='VertexAI 키'
                addButtonText='Google API 키'
                apiKeys={vertexAIAPIs}
            />
        </>
    )
}

interface SingleAPIKeySectionProps {
    title: string;
    provider: 'openai'|'anthropic'|'google'|'vertexai';

    addButtonText: string;
    
    apiKeys: APIKeyMetadata[];
}

function SingleAPIKeySection({ title, provider, addButtonText, apiKeys }: SingleAPIKeySectionProps) {
    const profile = useProfileEvent();

    return (
        <>
            <Row>
                <b className='undraggable'>{title}</b>
            </Row>
            <div style={{ height: '0.25em' }} />
            {
                apiKeys.map((item, index) => (
                    <APIItem
                        key={item.secret_id}
                        item={item}
                        onDelete={async () => {
                            await profile.removeAPIKey(provider, index);

                            return true;
                        }}
                        onChangeType={async (type) => {
                            await profile.changeAPIKeyType(provider, index, type);


                            return true;
                        }}
                    />
                ))
            }
            <AddAPIKeyButton
                title={addButtonText}
                onAddAPIKey={async (apiKey) => {
                    await profile.addAPIKey(provider, apiKey);

                    return true;
                }}
            />
        </>
    );
}
export default APIKeyOptions;