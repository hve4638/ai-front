

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useProfileAPIStore } from '@/stores';
import classNames from 'classnames';

type EditableTextProps = {
    value: string;
    displayValue?: string;
    editable? : boolean;
    onChange?: (value:string)=>void;
    onCancel?: () => void;
}

/**
 * EditableText - A component that renders text that can be made editable by double-clicking
 * 
 * @component
 * @param {Object} props - The component props
 * @param {string} props.value - The actual value of the text field
 * @param {string} [props.displayValue] - Optional alternate value to display when not in edit mode
 * @param {boolean} [props.editable=true] - Whether the text can be edited by the user
 * @param {Function} [props.onChange] - Callback function triggered when text value is changed
 * @param {Function} [props.onCancel] - Callback function triggered when editing is cancelled
 * 
 * @example
 * ```tsx
 * <EditableText 
 *   value="Original Text" 
 *   displayValue="Display Text"
 *   onChange={(newValue) => console.log(newValue)} 
 * />
 * ```
 * 
 * @returns A text element that becomes an input field when double-clicked
 */
function EditableText({
    value,
    displayValue,
    editable = true,
    onChange = ()=>{},
}:EditableTextProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [current, setCurrent] = useState(value);
    const [renameMode, setRenameMode] = useState(false);
    const api = useProfileAPIStore(state=>state.api);
    
    useLayoutEffect(()=>{
        setCurrent(value);
    }, [value]);

    const enableRenameMode = () => {
        if (editable) {
            setRenameMode(true);
            setTimeout(()=>{
                inputRef.current?.focus();
            }, 1);
        }
    }



    return (
        <span
            className={
                classNames(
                    'flex',
                    // 'session-name'
                )
            }
            style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
            }}
            onDoubleClick={enableRenameMode}
        >
        {
            !renameMode &&
            (displayValue ?? value)
        }
        {
            renameMode &&
            <input
                ref={inputRef}
                type='text'
                style={{
                    backgroundColor: 'transparent',
                }}
                value={current}
                onChange={(e)=>setCurrent(e.target.value)}
                onBlur={()=>{
                    onChange(current);
                    setRenameMode(false);
                }}
                onKeyDown={(e)=>{
                    if (e.key === 'Enter') {
                        onChange(current);
                        setRenameMode(false);
                    }
                    else if (e.key === 'Escape') {
                        setCurrent(value);
                        setRenameMode(false);
                    }
                }}
                spellCheck={false}
            />
        }
        </span>
    )
}

export default EditableText;