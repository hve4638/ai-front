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
        </div>
    );
}

export default TabContainer;