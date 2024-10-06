import React from 'react'
import { ButtonFull, InputSmall } from '../Forms'
import { DEFAULT_MAXTOKEN, DEFAULT_TEMPERATURE, DEFAULT_TOPP } from 'data/constants'

export function CommonOptions({ option, setOption }) {
    return (
        <>
            <InputSmall
                name = '응답 토큰 제한'
                value = {option.maxtoken ?? DEFAULT_MAXTOKEN}
                onChange={(value)=>{
                    const newOptions = {...option};
                    newOptions.maxtoken = value;
                    setOption(newOptions);
                }}
            />
            <InputSmall
                name = '온도'
                value = {option.temperature ?? DEFAULT_TEMPERATURE}
                onChange={(value)=>{
                    const newOptions = {...option};
                    newOptions.temperature = value;
                    setOption(newOptions);
                }}
            />
            <InputSmall
                name = 'top-p'
                value = {option.topp ?? DEFAULT_TOPP}
                onChange={(value)=>{
                    const newOptions = {...option};
                    newOptions.topp = value;
                    setOption(newOptions);
                }}
            />
        </>
    )
}