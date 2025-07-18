import { useState } from 'react';
import { Align, Center, Column, Flex, Row } from 'components/layout';

interface TabAddButtonProps {
    onClick? : () => void;
    x: number;
}

export function TabAddButton({
    onClick = ()=>{},
    x
}:TabAddButtonProps) {
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

export default TabAddButton;