import React from 'react';

interface InputFieldProps {
    text:string,
    className?:string,
    onChange:(x:string)=>void
}

export default function InputField({text, onChange, className=''}:InputFieldProps) {
    return (
        <div className={`${className} textarea-input-container`}>
            <textarea
              className='textarea-input scrollbar wfill fontstyle'
              spellCheck='false'
              value={text}
              onChange={(e)=>{onChange(e.target.value)}}
              >
            </textarea>
        </div>
    );
}

