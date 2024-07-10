import React, { useState } from "react"
import { GoogleFontIcon } from '../../components/GoogleFontIcon.tsx'

export const SelectFull = ({name, value, onClick}) => (
    <div className='column section'>
        {
            (name != null && name.length > 0) &&
            <p style={{marginBottom:'6px'}}>{name}</p>
        }
        <button
            className='shadow'
            onClick={(e)=>onClick()}
        >
            {value}
        </button>
    </div>
)

export const InputFull = ({name, value, onChange, placeholder}) => (
    <div className='column section'>
        <p style={{marginBottom:'6px'}}>{name}</p>
        <input 
            className='full'
            value={value}
            placeholder={placeholder}
            onChange={(e)=>onChange(e.target.value)}
        ></input>
    </div>
)  

export const InputSmall = ({name, value, onChange}) => (
    <div className='row section'>
    <p className='flex'>{name}</p>
    <input
        className='small'
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        ></input>
    </div>
)

export const ButtonFull = ({name, onClick}) => (
    <div className='row section'>
        <button
            className='button-red shadow'
            onClick={(e)=>onClick()}
        >
            {name}
        </button>
    </div>
)

export const FileUploadForm = ( {name, onUpload} ) => {
    const [onHover, setOnHover] = useState(false);

    return (
        <div className='column section'>
            <p style={{marginBottom:'6px'}}>{name}</p>
            <div>
                <label
                    className={`${onHover ? 'inputform-on-mouse' : ''} wfill center upload-container clickable`}
                    
                    onDragEnter={()=>setOnHover(true)}
                    onDragLeave={()=>setOnHover(false)}
                    onDragOver={(event)=>event.preventDefault()}
                    onDrop={(event)=>{
                        event.preventDefault();
                        
                        const files = event.dataTransfer.files;
                        console.log(files);
                        if (files.length > 0) {
                            onUpload(files);
                        }
                    }}
                >
                    <span style={{marginRight: "6px"}}>파일 선택</span>
                    <span
                        className="material-symbols-outlined"
                        style={{fontSize: "22px", pointerEvents: "auto" }}
                    >upload_file</span>
                    <input
                        type="file"
                        className="hide"
                        onChange={(event) => {
                           const files = event.target.files ?? [];
                           if (files.length === 0) {
                               return;
                           }
           
                           onUpload(files);
                        }}
                    />
                </label>
            </div>
        </div>
    );
}