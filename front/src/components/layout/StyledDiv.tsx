import React from 'react';

export interface StyledDivTags {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
}

export interface StyledDivProps {
    baseClassName: string;
    tags?: StyledDivTags;
}

function StyledDiv({
    baseClassName,
    tags = {}
}:StyledDivProps) {
    const {
        className = '',
        style = {},
        children,
        onClick,
        onMouseDown
    } = tags;

    return (
        <div
            className={
                `${baseClassName} ${className}`
            }
            style={style}
            onClick={onClick}
            onMouseDown={onMouseDown}
        >
            {
                children != null &&
                children
            }
        </div>
    );
}

export default StyledDiv;