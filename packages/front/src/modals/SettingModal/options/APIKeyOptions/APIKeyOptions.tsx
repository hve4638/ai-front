import { useMemo, useState } from 'react';
import { useDataStore } from '@/stores';
import VertexAIKeySection from './VertexAIKeySection';
import SingleAPIKeySection from './SingleAPIKeySection'
import CustomAuthSection from './CustomAuthSection';

function APIKeyOptions() {
    const { api_keys } = useDataStore();

    const {
        openAIAPIs,
        anthropicAPIs,
        googleAPIs,
        vertexAIAPIs,
        customAuth,
    } = useMemo(()=>{
        return {
            openAIAPIs: api_keys['openai'] ?? [],
            anthropicAPIs: api_keys['anthropic'] ?? [],
            googleAPIs: api_keys['google'] ?? [],
            vertexAIAPIs: api_keys['vertexai'] ?? [],
            customAuth: api_keys['custom'] ?? []
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
                title='Google Cloud'
                provider='google'
                addButtonText='Google Cloude API 키'
                apiKeys={googleAPIs}
            />
            <div style={{ height: '1em' }} />
            <VertexAIKeySection
                title='VertexAI'
                addButtonText='VertexAI API 키'
                apiKeys={vertexAIAPIs}
            />
            <div style={{ height: '1em' }} />
            <CustomAuthSection
                title='Custom'
                addButtonText='Custom 키'
                apiKeys={customAuth}
            />
        </>
    )
}

export default APIKeyOptions;