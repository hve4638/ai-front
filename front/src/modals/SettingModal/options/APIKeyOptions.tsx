import { useState } from 'react';
import DivButton from 'components/DivButton';
import { useModal } from 'hooks/useModal';
import StringInputModal from 'modals/StringInputModal';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { Align, Flex, Row } from 'components/layout';
import Dropdown from 'components/Dropdown';
import { APIKeyMetadata } from 'types/apikey-metadata';
import { useDataStore, useProfileEvent } from '@/stores';


function APIKeyOptions() {
    const profile = useProfileEvent();
    const dataStore = useDataStore();

    const openAIAPIs = dataStore.api_keys_metadata['openai'] ?? [];

    return (
        <>
            <Row>
                <b className='undraggable'>OpenAI</b>
            </Row>
            <div style={{height: '0.25em'}}/>
            {
                openAIAPIs.map((item, index)=>(
                    <APIItem
                        key={item.secret_id}
                        item={item}
                        onDelete={async ()=>{
                            await profile.removeAPIKey('openai', index);
                        }}
                        onChangeType={async (type)=>{
                            await profile.changeAPIKeyType('openai', index, type);
                        }}
                    />
                ))
            }
            <AddAPIKeyButton
                title='OpenAI API 키'
                onAddAPIKey={async (apiKey)=>{
                    await profile.addAPIKey('openai', apiKey);
                }}
            />
            <div style={{height: '1em'}}/>
            <b className='undraggable'>Anthropic Claude</b>
            <div style={{height: '0.25em'}}/>
            
            <AddAPIKeyButton
                title='Anthropic API 키'
                onAddAPIKey={async (apiKey)=>{
                    await profile.addAPIKey('anthropic', apiKey);
                }}
            />
            <div style={{height: '1em'}}/>
            <b className='undraggable'>Google Gemini</b>
            <div style={{height: '0.25em'}}/>
            <AddAPIKeyButton
                title='Google API 키'
                onAddAPIKey={async (apiKey)=>{
                    await profile.addAPIKey('google', apiKey);
                }}/>
            <div style={{height: '1em'}}/>
            <b className='undraggable'>VertexAI</b>
            <div style={{height: '0.25em'}}/>
            <AddAPIKeyButton
                title='VertexAI API 키'
                onAddAPIKey={async (apiKey)=>{

                }}
            />
        </>
    )
}

type APIItemProps = {
    item : APIKeyMetadata;
    onDelete : ()=>void;
    onChangeType : (type:'primary'|'secondary')=>void;
}

function APIItem({ item, onDelete, onChangeType }:APIItemProps) {
    return (
        <Row
            className='undraggable'
            style={{
                padding : '0 0.5em',
                gap : '0.5em',
            }}
            columnAlign={Align.Center}
        >
            <small>{item.display_name}</small>
            <Flex/>
            <Dropdown
                style={{
                    fontSize: '0.8em'
                }}
                items={[{name:'주', key:'primary'}, {name:'보조', key:'secondary'}]}
                value={item.type}
                onChange={(value)=>{
                    onChangeType(value.key as 'primary'|'secondary');
                }}
                onItemNotFound={()=>{
                    onChangeType('primary');
                }}
            />
            <GoogleFontIcon
                className='undraggable clickable'
                style={{
                    height: '100%',
                    cursor: 'pointer',
                }}
                value='delete'
                enableHoverEffect={true}
                onClick={()=>onDelete()}
            />
        </Row>
    );
}

function AddAPIKeyButton({
    title,
    onAddAPIKey = (apiKey:string)=>{}
}:{
    title : string,
    onAddAPIKey:(apiKey:string)=>void
}) {
    const modal = useModal();

    return (
        <DivButton
            center={true}
            onClick={()=>{
                modal.open(StringInputModal, {
                    title,
                    onSubmit : onAddAPIKey,
                    placeholder : 'API 키',
                });
            }}
        >
            <GoogleFontIcon
                value='add_circle'
                style={{
                    marginRight: '0.25em',
                }}
            />
            <span>새로운 키 입력</span>
        </DivButton>
    )
}

export default APIKeyOptions;