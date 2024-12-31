

interface GridProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    rows: string;
    columns: string;

    onClick?: ()=>void;
}

function Grid({
    className = '',
    style = {},
    rows,
    columns,
    onClick,
    children,
}:GridProps) {
    return (
        <div
            className={className}
            style={{
                display: 'grid',
                gridTemplateRows: rows,
                gridTemplateColumns: columns,
                ...style,
            }}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

export default Grid;