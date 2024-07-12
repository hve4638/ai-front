import React, { useState, createContext, useEffect } from "react";
import { useEncryptedCookie } from '../hooks/useEncryptedCookie.tsx';
import { ENCRYPT_KEY, COOKIE_OPTION_NOEXPIRE } from '../data/constants.tsx'

export interface ModelInfo {
    category:string;
    model:string;
    modelOptions:{[modelname:string]:{[key:string]:any}}
}

export interface APIContextType {
    topp:string,
    setTopp:(x:string)=>boolean,
    temperature:string,
    setTemperature:(x:string)=>boolean,
    maxtoken:string
    setMaxtoken:(x:string)=>boolean
    modelInfo:ModelInfo,
    setModelInfo:(x:ModelInfo)=>void,
}

export const APIContext = createContext<APIContextType|null>(null);

/// @TODO : StoreContext에 통합하기
export default function APIContextProvider({children}) {
    const [modelInfo, setModelInfo] = useEncryptedCookie('model', ENCRYPT_KEY);
    const [topp, setRawTopp] = useEncryptedCookie('topp', ENCRYPT_KEY);
    const [temperature, setRawTemperature] = useEncryptedCookie('temperature', ENCRYPT_KEY);
    const [maxtoken, setRawMaxtoken] = useEncryptedCookie('maxtoken', ENCRYPT_KEY);

    const setTopp = (value:string, options?:any) => {
        const num = parseNumber(value);
        if (num == null) {
            return false;
        }
        else {
            setRawTopp(value, options);
            return true;
        }
    }
    const setTemperature = (value:string, options?:any) => {
        const num = parseNumber(value);
        if (num == null) {
            return false;
        }
        else if (num > 0 && num <= 1) {
            setRawTemperature(value, options);
            return true;
        }
        else {
            return false;
        }
    }
    const setMaxtoken = (value:string, options?:any) => {
        const num = parseInteger(value);
        if (num == null) {
            return false;
        }
        else if (num <= 0) {
            return false;
        }
        else {
            setRawMaxtoken(value, options);
            return true;
        }
    }

    return (
        <APIContext.Provider
            value={{
                modelInfo : modelInfo ?? {category:null,model:null,modelOptions:{}},
                setModelInfo : (x:object)=>setModelInfo(x, COOKIE_OPTION_NOEXPIRE),
                topp : topp ?? '1.0',
                temperature : temperature ?? '1.0',
                maxtoken : maxtoken ?? '1000',
                setTopp : (x:string)=>setTopp(x, COOKIE_OPTION_NOEXPIRE),
                setTemperature : (x:string)=>setTemperature(x, COOKIE_OPTION_NOEXPIRE),
                setMaxtoken : (x:string)=>setMaxtoken(x, COOKIE_OPTION_NOEXPIRE),
            }}
        >
            {children}
        </APIContext.Provider>
    )
}

function parseNumber(value) {
    const num = value - 0;
    return isNaN(num) ? null : num;
}
function parseInteger(value) {
    const num = value - 0;
    if (!isNaN(value-0) && Math.floor(value-0) == value-0) {
        return num;
    }
    else {
        return null;
    }
}