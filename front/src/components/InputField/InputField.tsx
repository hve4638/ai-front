import React from 'react';
import MarkdownArea from '../MarkdownArea';

interface InputFieldProps {
    text: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onChange: (x: string) => void;
    tabIndex?: number;
    readonly?: boolean;
    markdown?: boolean;
}

function InputField({
    children,
    className = '',
    style = {},
    text,
    tabIndex,
    onChange,
    readonly=false,
    markdown=false
}: InputFieldProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className={`input-field-container ${className}`}
            style={{
                position: 'relative',
                ...style
            }}
            onKeyDown={(e) => {
                if (e.key === 'a' && e.ctrlKey) {
                    if (containerRef.current) {
                        const range = document.createRange();
                        range.selectNodeContents(containerRef.current);

                        const selection = window.getSelection();
                        if (selection) {
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }

                    e.preventDefault();
                }
            }}
        >
            {
                !markdown &&
                <textarea
                    readOnly={readonly}
                    className='input-field fill fontstyle scrollbar'
                    style={{
                        resize: 'none',
                        width: '100%',
                        height: '100%',
                        boxSizing: 'border-box',
                        overflowY: 'auto',
                    }}

                    spellCheck='false'
                    value={text}
                    onChange={(e) => onChange(e.target.value)}
                    tabIndex={tabIndex}
                />
            }
            {
                markdown &&
                <MarkdownArea
                    className='fill fontstyle'
                    style={{
                        // overflowX: 'hidden',
                        // overflowY: 'auto',
                    }}
                    content={text}
                />
            }
            {
                children != null &&
                children
            }
        </div>
    );
}

export default InputField;