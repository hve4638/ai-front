import { useState } from 'react';
import { Align, Center, Column, Flex, Row } from 'lib/flex-widget';
import { SessionColor, SessionStatus, type SessionSummary } from 'features/sessions';
import { GoogleFontIcon } from 'components/GoogleFontIcon';

interface SessionAddButtonProps {
    onClick? : () => void;
    x: number;
}

export function SessionAddButton({
    onClick = ()=>{},
    x
}:SessionAddButtonProps) {
    return (
        <Center
            className='session-add-button absolute'
            style={{
                height : '100%',
                width : '32px',
                left : `${x}px`,
            }}
            onClick={(e)=>onClick()}
        >
            <span>
                +
            </span>
            <div className='hover-effect'/>
        </Center>
    );
}

export default SessionAddButton;