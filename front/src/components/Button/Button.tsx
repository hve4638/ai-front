import classNames from "classnames";

interface ButtonProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    children?: React.ReactNode;
    disabled?:boolean;
}

function Button({
    disabled=false,
    className='',
    style={},
    children,
    onClick=()=>{}
}: ButtonProps) {
    return (
        <button
            className={
                classNames(
                    'button',
                    className,
                    { disabled : disabled }
                )
            }
            style={{
                ...style,
            }}
            onClick={()=>onClick()}
        >
            {
                children != null &&
                children
            }
        </button>
    )
}

export default Button;