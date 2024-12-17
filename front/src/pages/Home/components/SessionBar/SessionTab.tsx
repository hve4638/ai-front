import { useState } from 'react';
import { Align, Center, Column, Flex, Row } from 'lib/flex-widget';
import { SessionColor, SessionStatus, type SessionSummary } from 'features/sessions';
import { GoogleFontIcon } from 'components/GoogleFontIcon';

interface SessionTabProps {
    name:string;
    width : string;
    enabled? : boolean;
    leftEnabled? : boolean;
    rightEnabled? : boolean;
    x:number;
    onClick? : () => void;
}

function SessionTab({
    name,
    enabled=false,
    width,
    x,
}:SessionTabProps) {
    return (
        <div
            className={
                'session-tab absolute' + (enabled ? ' enabled' : '')
            }
            style={{
                width : width,
                height : '26px',
                left : x + 'px',
            }}
        >
            <span
                style={{
                    paddingLeft: '1em'
                }}
            >
                {name}
            </span>
            <Flex/>
            <Column
                columnAlign={Align.Center}
            >
                <GoogleFontIcon
                    className='clickable-icon'
                    value='close'
                    style={{
                        marginRight: '8px',
                        width: '20px',
                        height: '20px',
                    }}
                />
            </Column>
            <div className='hover-effect'/>
        </div>
    );
}

export default SessionTab;