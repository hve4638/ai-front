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
                    'btn-radius',
                    className,
                    { disabled : disabled }
                )
            }
            tabIndex={disabled ? -1 : 0}
            style={{
                ...style,
            }}
            onClick={()=>{
                if (!disabled) {
                    onClick();
                }
            }}
            onKeyDown={(e)=>{
                if (e.key === 'Enter' && !disabled) {
                    onClick();
                    e.stopPropagation();
                }  
            }}
        >
            {
                children != null &&
                children
            }
        </button>
    )
}

export default Button;