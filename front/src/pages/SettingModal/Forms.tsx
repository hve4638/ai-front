import React, { useState } from "react"
import { Checkbox } from 'components/Checkbox'

export const SelectFull = ({name, value, onClick}) => (
    <div className='column item'>
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

export function RowCheckBox({name, value, onChange}) {
    return (
        <div
            className='setting-form item row main-spacebetween'
            style={{alignItems:'center', paddingLeft: '8px'}}
        >
            <span><strong>{name}</strong></span>
            <Checkbox
                style={{height : '22px'}}
                checked={value}
                onChange={()=>onChange(!value)}
            />
        </div>
    )
}

export const InputFull = ({name, value, onChange, placeholder}) => (
    <div className='item column'>
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
    <div className='item row'>
        <p className='flex'>{name}</p>
        <input
            className='small'
            value={value}
            onChange={(e)=>onChange(e.target.value)}
        ></input>
    </div>
)

export const ButtonFull = ({name, onClick}) => (
    <div className='item row'>
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
        <div className='column item'>
            <p style={{marginBottom:'6px'}}>{name}</p>
            <div>
                <label
                    className={`${onHover ? 'ondraghover' : ''} wfill center upload-container clickable`}
                    
                    onDragEnter={()=>setOnHover(true)}
                    onDragLeave={()=>setOnHover(false)}
                    onDragOver={(event)=>event.preventDefault()}
                    onDrop={(event)=>{
                        
                        const files = event.dataTransfer.files;
                        if (files.length > 0) {
                            onUpload(files);
                        }
                        event.preventDefault();
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