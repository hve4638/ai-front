import { useEffect, useState } from 'react';
import { Align, Center, Column, Flex, Row } from 'components/layout';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { SpinnerCircular } from 'spinners-react';

interface TabProps {
    className?:string;
    style?:React.CSSProperties;
    name:string;
    widthPx : number;
    enabled? : boolean;
    loading? : boolean;
    noAnimation? : boolean;
    x:number;
    onClick? : () => void;
    onClose? : () => void;
}

function Tab({
    className='',
    style={},
    name,
    enabled=false,
    loading=false,
    noAnimation=false,
    widthPx,
    x,
    onClick = ()=>{},
    onClose = ()=>{},
}:TabProps) {
    const hideTitle = widthPx <= 60;
    const hideCloseButton = widthPx <= 60 && !enabled;

    return (
        <div
            className={
                'tab absolute'
                + (enabled ? ' enabled' : '')
                + (noAnimation ? ' instant' : '')
                + ` ${className}`
            }
            style={{
                width : widthPx + 'px',
                height : '100%',
                left : x + 'px',
                ...style,
            }}
            onMouseDown={(e)=>{
                if (e.button === 0) {
                    onClick()
                }
                else if (e.button === 1) {
                    onClose();
                }
            }}
        >
            {
                !hideTitle &&
                <span
                    style={{
                        paddingLeft: '1em',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {name + '#'}
                </span>
            }
            <Flex/>
            <Center
                style={{
                    marginRight : '0.25em',
                }}
            >
                <SpinnerCircular
                    size={'1em'}
                    thickness={100}
                    color='white'
                />
            </Center>
            <Column
                columnAlign={Align.Center}
            >
                {
                    hideCloseButton &&
                    <div
                        style={{
                            marginRight: '8px',
                            width: '20px',
                            height: '20px',
                        }}
                    />
                }
                {
                    !hideCloseButton &&
                    <GoogleFontIcon
                        className='close-button'
                        value='close'
                        style={{
                            marginRight: '8px',
                            width: '20px',
                            height: '20px',
                        }}
                        onClick={(e)=>{
                            onClose();
                        }}
                    />
                }
            </Column>
        </div>
    );
}

export default Tab;