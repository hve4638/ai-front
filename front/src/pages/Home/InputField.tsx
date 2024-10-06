import React from 'react';
import { GoogleFontIcon } from 'components/GoogleFontIcon';

interface InputFieldProps {
    text:string;
    className?:string;
    onSubmit:()=>void;
    loading:boolean;
    onChange:(x:string)=>void;
}

export default function InputField({text, onSubmit, onChange, loading, className=''}:InputFieldProps) {
    return (
        <div className={`input-section-container textfield ${className}`}>
            <textarea
              className='input-section-textarea fontstyle scrollbar'
              spellCheck='false'
              value={text}
              onChange={(e)=>{onChange(e.target.value)}}
              >
            </textarea>
            {
                !loading &&
                <GoogleFontIcon
                    className='floating-button smallwidth-only'
                    value='send'
                    onClick={()=>onSubmit()}
                />
            }
            {
                loading &&
                <GoogleFontIcon
                    className='floating-button smallwidth-only rotate'
                    value='refresh'
                    onClick={()=>{}}
                />
            }
        </div>
    );
}

