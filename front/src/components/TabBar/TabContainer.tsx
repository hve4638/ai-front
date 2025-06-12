import { useEffect, useState } from 'react';
import { Align, Center, Column, Flex, Row } from 'components/layout';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { SpinnerCircular } from 'spinners-react';
import { TabRender } from './types';
import classNames from 'classnames';

interface TabProps<T> {
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

    children?: React.ReactNode;
}

function TabContainer<T>({
    className='',
    style={},
    name,
    enabled=false,
    noAnimation=false,
    widthPx,
    x,
    onClick = ()=>{},
    onClose = ()=>{},
    children,
}:TabProps<T>) {
    return (
        <div
            className={
                classNames(
                    'absolute',
                    'tab-container',
                    {
                        enabled,
                        instant : noAnimation,
                    },
                    className
                )
            }
            style={{
                width : widthPx + 'px',
                height : '100%',
                left : x + 'px',
                ...style,
            }}
        >
            {
                children
            }
            {/* {
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
            </Column> */}
        </div>
    );
}

export default TabContainer;