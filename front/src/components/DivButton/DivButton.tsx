import classNames from 'classnames';
import styles from './styles.module.scss';

type DivButtonProps = {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLLabelElement>) => void;
}

function DivButton({
    className='',
    style={},
    onClick=()=>{},
    children=<></>
}:DivButtonProps) {
    return (
        <div
            className={
                classNames(styles['div-button'], 'undraggable', className)
            }
            style={style}
        >
            <label
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                }}
                onClick={onClick}
            >{children}</label>
        </div>
    );
}

export default DivButton;