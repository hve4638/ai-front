import { DragActionProps } from '@/types';
import React, { forwardRef } from 'react';

interface GridProps extends DragActionProps<HTMLDivElement> {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    rows: string;
    columns: string;
    tabIndex?: number;
    onClick?: () => void;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
    {
        id,
        className = '',
        style = {},
        rows,
        columns,
        onClick,
        children,
        tabIndex = -1,
        
        onDragStart,
        onDragOver,
        onDragEnter,
        onDragLeave,
        onDrop,
    },
    ref
) {
    return (
        <div
            ref={ref}
            id={id}
            className={className}
            style={{
                display: 'grid',
                gridTemplateRows: rows,
                gridTemplateColumns: columns,
                ...style,
            }}
            onClick={onClick}
            tabIndex={tabIndex}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            {children}
        </div>
    );
});

export default Grid;