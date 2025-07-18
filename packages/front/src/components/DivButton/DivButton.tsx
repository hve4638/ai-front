import classNames from 'classnames';
import styles from './styles.module.scss';
import { KeyboardEventHandler } from 'react';

type DivButtonProps = {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    center?: boolean;
    onClick?: (e: React.KeyboardEvent<HTMLDivElement>|React.MouseEvent<HTMLDivElement>) => void;
}

function DivButton({
    className='',
    style={},
    onClick=(e)=>{},
    center=false,
    children=<></>
}:DivButtonProps) {
    return (
        <div
            className={
                classNames(styles['div-button'], 'undraggable', className)
            }
            style={style}
            tabIndex={0}
            onClick={(e)=>onClick(e)}
            onKeyDown={(e)=>{
                if (e.key === 'Enter') {
                    onClick(e);
                }
            }}
        >
            <label
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                    alignItems: 'center',
                    justifyContent: center ? 'center' : 'flex-start',
                }}
            >{children}</label>
        </div>
    );
}

export default DivButton;