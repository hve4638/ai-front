import { useState } from 'react'
import CloseIcon from '../Icons/close.svg'

function SettingModal({ 
    temperature, topp, apikey, maxtoken,
    onClose
 }) {
    const isNum = (value) => !isNaN(value-0)
    const isInt = (value) => !isNaN(value-0) && Math.floor(value-0) == value-0
    const [toppInput, setToppInput] = useState(topp);
    const [temperatureInput, setTemperatureInput] = useState(temperature);
    const [apikeyInput, setApikeyInput] = useState('');
    const [maxtokenInput, setMaxtokenInput] = useState(maxtoken);

    return (
        <div className='modal-background center'>
            <div className='modal setting-container undraggable column'>
                <div className='row' style={{marginBottom:'16px'}}>
                    <h2>설정</h2>
                    <div className='flex'/>
                    <span
                        className="material-symbols-outlined clickable modal-close-button"
                        onClick={(e)=>{
                            onClose({
                                apikey : apikeyInput != '' ? apikeyInput : apikey,
                                maxtoken : isInt(maxtokenInput) ? maxtokenInput : maxtoken,
                                topp : isNum(toppInput) ? toppInput : topp,
                                temperature : isNum(temperatureInput) ? temperatureInput : temperature
                            })
                        }}
                    >
                        close
                    </span>
                </div>
                <InputFull
                    name='Gemini API키'
                    value={apikeyInput}
                    onChange={(value)=>setApikeyInput(value)}
                    placeholder='no changed'
                />
                <InputSmall
                    name = "응답 토큰 제한"
                    value = {maxtokenInput}
                    onChange={setMaxtokenInput}
                />
                <InputSmall
                    name = "온도"
                    value = {temperatureInput}
                    onChange={setTemperatureInput}
                />
                <InputSmall
                    name = "top-p"
                    value = {toppInput}
                    onChange={setToppInput}
                />
            </div>
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
        type='text'
        className='small'
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        ></input>
    </div>
)
  
export default SettingModal;