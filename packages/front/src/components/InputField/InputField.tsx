import React from 'react';
import MarkdownArea from '../MarkdownArea';
import { CommonProps, DragActionProps } from '@/types';

interface InputFieldProps extends CommonProps, DragActionProps<HTMLDivElement> {
    text: string;
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
    markdown=false,

    onDragStart,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onDrop,
}: InputFieldProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className={`input-field-container ${className}`}
            style={{
                display: 'block',
                position: 'relative',
                overflowX: 'hidden',
                overflowY: 'hidden',
                ...style
            }}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
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
                        paddingBottom: '2em',
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
                        paddingBottom: '2em',
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
                    content={text}
                />
            }
            {/* <div style={{ height: '15px' }}>a</div> */}
            {
                children != null &&
                children
            }
        </div>
    );
}

export default InputField;