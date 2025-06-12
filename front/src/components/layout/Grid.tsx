import React, { forwardRef } from 'react';

interface GridProps {
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
        >
            {children}
        </div>
    );
});

export default Grid;