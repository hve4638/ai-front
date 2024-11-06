import { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import LocalAPI from 'api'
import { useRawProfileStorage } from './useRawProfileStorage';

function makeSalt() {
    return Math.floor(Math.random() * 1000000);
} 

type useProfileEncryptedValueAddition = {
    default_value?: any;
    encryptionKey: string;
}

/**
 * @returns [value, setValue, refetchCache]
 */
export function useEncryptedProfileStorage(
    profileName:string,
    category: string,
    key:string,
    {
        default_value,
        encryptionKey
    }:useProfileEncryptedValueAddition
) {
    const encode = (value:any) => {
        const salt = makeSalt();
        const jsonText = JSON.stringify({ value, salt })
        return CryptoJS.AES.encrypt(jsonText, encryptionKey).toString();
    }
    const decode = (chiper:string|undefined) => {
        if (chiper == null) {
            return default_value;
        }
        const jsonText = CryptoJS.AES.decrypt(chiper, encryptionKey).toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(jsonText);
        return data.value ?? default_value;
    }
    
    return useRawProfileStorage(profileName, category, key, { encode, decode });
}