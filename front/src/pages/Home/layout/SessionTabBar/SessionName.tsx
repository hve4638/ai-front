import { useProfileAPIStore } from "@/stores";
import classNames from "classnames";
import { LegacyRef, useEffect, useRef, useState } from "react";
import styles from './styles.module.scss';

type SessionNameProps = {
    name: string;
    displayName: string;
    rename: boolean;
    highlight?: boolean;
    onEnableRename?: () => void;
    onChange?: (value:string)=>void;
    onCancelRename?: () => void;
}

function SessionName({
    name,
    displayName,
    rename,
    highlight = false,
    onEnableRename = () => {},
    onChange = ()=>{},
    onCancelRename = ()=>{},
}:SessionNameProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(name);
    
    useEffect(()=>{
        setValue(name);
    }, [name]);

    useEffect(()=>{
        if (rename) {
            setTimeout(()=>{
                inputRef.current?.focus();
            }, 1);
        }
    }, [rename]);

    return (
        <span
            className={
                classNames(
                    'flex',
                )
            }
            style={{
                marginLeft: '1em',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
            }}
            onDoubleClick={onEnableRename}
        >
        {
            !rename &&
            <span
                className={
                    classNames(
                        styles['session-name'],
                        { [styles['highlight']]: highlight },
                    )}
            >{displayName}</span>
        }
        {
            rename &&
            <input
                ref={inputRef}
                type='text'
                style={{
                    backgroundColor: 'transparent',
                }}
                value={value}
                onChange={(e)=>setValue(e.target.value)}
                onBlur={()=>onChange(value)}
                onKeyDown={(e)=>{
                    if (e.key === 'Enter') {
                        onChange(value);
                    }
                    else if (e.key === 'Escape') {
                        setValue(name);
                        onCancelRename();
                    }
                }}
                spellCheck={false}
            />
        }
        </span>
    )
}

export default SessionName;