import React from 'react';

interface InputFieldProps {
    text: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onChange: (x: string) => void;
    tabIndex?: number;
    readonly?: boolean;
}

function InputField({
    children,
    className = '',
    style = {},
    text,
    tabIndex,
    onChange,
    readonly=false
}: InputFieldProps) {
    return (
        <div
            className={`input-field-container ${className}`}
            style={{
                position: 'relative',
                ...style
            }}
        >
            <textarea
                readOnly={readonly}
                className='input-field fill fontstyle scrollbar'
                spellCheck='false'
                value={text}
                onChange={(e) => onChange(e.target.value)}
                tabIndex={tabIndex}
            />
            {
                children != null &&
                children
            }
        </div>
    );
}

export default InputField;