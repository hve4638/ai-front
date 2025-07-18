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