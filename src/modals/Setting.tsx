import React, { useState, useContext } from 'react'
import { APIContext } from '../context/APIContext.tsx'
import ModalHeader from '../components/ModalHeader.tsx'

interface SettingModalProps {
    onClose:({ topp, temperature, apikey, maxtoken })=>void
}

function SettingModal({
    onClose
 }:SettingModalProps) {
    const apiContext = useContext(APIContext);
    if (apiContext == null) {
        throw new Error('SettingModel required APIContextProvider')
    }
    const [topp, setTopp] = useState(apiContext.topp);
    const [temperature, setTemperature] = useState(apiContext.temperature);
    const [apikey, setAPIKey] = useState('');
    const [maxtoken, setMaxtoken] = useState(apiContext.maxtoken);

    return (
        <div className='modal setting-container undraggable column'>
            <ModalHeader
                name='설정'
                onClose = {()=>{
                    onClose({
                        topp, temperature, apikey, maxtoken
                    })
                }}
            />
            <div style={{height:'20px'}}/>
            <InputFull
                name='Gemini API키'
                value={apikey}
                onChange={(value:string)=>setAPIKey(value)}
                placeholder={apiContext.apikey.length > 0 ? 'no change' : 'apikey'}
            />
            <InputSmall
                name = "응답 토큰 제한"
                value = {maxtoken}
                onChange={setMaxtoken}
            />
            <InputSmall
                name = "온도"
                value = {temperature}
                onChange={setTemperature}
            />
            <InputSmall
                name = "top-p"
                value = {topp}
                onChange={setTopp}
            />
        </div>
    )
}

const InputFull = ({name, value, onChange, placeholder}) => (
    <div className='column section' style={{marginBottom:'24px'}}>
        <p style={{marginBottom:'6px'}}>{name}</p>
        <input 
            className='full'
            value={value}
            placeholder={placeholder}
            onChange={(e)=>onChange(e.target.value)}
        ></input>
    </div>
)  

const InputSmall = ({name, value, onChange}) => (
    <div className='row section'>
    <p className='flex'>{name}</p>
    <input
        className='small'
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        ></input>
    </div>
)
  
export default SettingModal;