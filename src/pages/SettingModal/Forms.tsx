import React from "react"

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
