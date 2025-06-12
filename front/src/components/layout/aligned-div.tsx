import { forwardRef } from 'react';
import { Align } from './types';

export interface AlignedDivProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;

    rowAlign?: Align;
    columnAlign?: Align;
    reverse?: boolean;

    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onRClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onDoubleClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;

    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseMove?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;

    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
    draggable?: boolean;
}

export function Column({
    className = '',
    style = {},
    children,
    rowAlign = Align.Start,
    columnAlign = Align.Start,
    reverse = false,
    onClick,
}: AlignedDivProps) {
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


export const Row = forwardRef(
    (props: AlignedDivProps, ref: React.LegacyRef<HTMLDivElement>) => {
        const {
            className = '',
            style = {},
            rowAlign = Align.Start,
            columnAlign = Align.Start,
            reverse = false,
        } = props;

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
                onClick={props.onClick}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
                onMouseMove={props.onMouseMove}
                onMouseDown={props.onMouseDown}
                onDoubleClick={props.onDoubleClick}
                onContextMenu={props.onRClick}
            >
                {props.children}
            </div>
        );
    }
);