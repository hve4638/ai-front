import { useState } from 'react';
import { ButtonForm, DropdownForm, NumberForm, StringForm, StringLongForm, ToggleSwitchForm } from 'components/Forms';
import { useConfigStore } from '@/stores';

function ServerOptions() {
    const [enabled, setEnabled] = useState(false);
    const [port, setPort] = useState(4000);

    return (
        <>
            <ToggleSwitchForm
                name='서버 활성화'
                enabled={enabled}
                onChange={(value)=>setEnabled(value)}
            />
            <NumberForm
                name='포트'
                width='4em'
                value={port}
                onChange={(value)=>setPort(value)}
            />

            
        </>
    )
}

export default ServerOptions;