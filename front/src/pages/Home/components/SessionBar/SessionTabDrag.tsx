import { useState } from 'react';
import { Align, Center, Column, Flex, Row } from 'lib/flex-widget';
import { SessionColor, SessionStatus, type SessionSummary } from 'features/sessions';
import { GoogleFontIcon } from 'components/GoogleFontIcon';

interface SessionTabProps {
    name:string;
    enabled? : boolean;
    leftEnabled? : boolean;
    rightEnabled? : boolean;
    onClick? : () => void;
}

function SessionTabDrag({
    name,
}:SessionTabProps) {
    return (
        <div
            className={
                'absolute session-tab enabled'
            }
            style={{
                width : '200px',
                height : '26px',
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

export default SessionTabDrag;