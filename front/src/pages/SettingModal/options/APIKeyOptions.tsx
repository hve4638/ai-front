import { useState } from 'react';
import { DropdownForm, NumberForm, StringForm, StringLongForm, ToggleSwitchForm } from 'components/Forms';


function APIKeyOptions() {
    const [layout, setLayout] = useState('auto');
    const [apiKey, setAPIKey] = useState('');

    return (
        <>
            <b className='undraggable'>OpenAI</b>
            <StringLongForm
                name='API 키'
                value={apiKey}
                onChange={setAPIKey}
            />
            <div style={{height: '1em'}}/>
            <b className='undraggable'>Anthropic Claude</b>
            <StringLongForm
                name='API 키'
                value={apiKey}
                onChange={setAPIKey}
            />
            <div style={{height: '1em'}}/>
            <b className='undraggable'>Google Gemini</b>
            <StringLongForm
                name='API 키'
                value={apiKey}
                onChange={setAPIKey}
            />
            <div style={{height: '1em'}}/>
            <b className='undraggable'>VertexAI</b>
            
            
        </>
    )
}

export default APIKeyOptions;