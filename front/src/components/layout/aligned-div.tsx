import { forwardRef } from 'react';
import { Align } from './types';

export interface AlignedDivProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    rowAlign?: Align;
    columnAlign?: Align;
    reverse?: boolean;

    onClick?: ()=>void;
    onRClick?: (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>void;
}

export function Column({
    className = '',
    style = {},
    children,
    rowAlign = Align.Start,
    columnAlign = Align.Start,
    reverse = false,
    onClick,
}:AlignedDivProps) {
    return (
        <div
            className={className}
            style={{
                display: 'flex',
                flexDirection: reverse ? 'column-reverse' : 'column',
                justifyContent: columnAlign,
                alignItems: rowAlign,
                ...style,
            }}
            onClick={onClick}
        >
            {children}
        </div>
    )
}


export const Row = forwardRef(({
    className = '',
    style = {},
    children,
    rowAlign = Align.Start,
    columnAlign = Align.Start,
    reverse = false,
    onClick,
    onRClick,
}:AlignedDivProps, ref:React.LegacyRef<HTMLDivElement>) => {
    return (
        <div
            ref={ref}
            className={className}
            style={{
                display: 'flex',
                flexDirection: reverse ? 'row-reverse' : 'row',
                justifyContent: rowAlign,
                alignItems: columnAlign,
                ...style,
            }}
            onClick={onClick}
            onContextMenu={onRClick}
        >
            {children}
        </div>
    )
});