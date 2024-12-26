type HoverEffectProps = {
    className?: string;
    style?: React.CSSProperties;
    enabled?: boolean;
}

function HoverEffect({
    className = '',
    style={},
    enabled = false,
}:HoverEffectProps) {
    return (
        <div
            className={
                `hover-effect`
                + enabled ? ' enabled' : ''
                + className === '' ? '' : ` ${className}`
            }
            style={style}
        />
    );
}

export default HoverEffect;