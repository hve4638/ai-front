import { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import LocalAPI from 'api'

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
export function useProfileEncryptedValue(profileName:string, category: string, key:string, addtion:useProfileEncryptedValueAddition) {
    const [cached, setCached] = useState<any>(undefined);
    const {
        default_value,
        encryptionKey
    } = addtion;

    const encode: (x: any) => string = (value) => {
        const salt = makeSalt();
        const jsonText = JSON.stringify({ value, salt })
        return CryptoJS.AES.encrypt(jsonText, encryptionKey).toString();
    }
    const decode: (x: string) => any = (chiper) => {
        const jsonText = CryptoJS.AES.decrypt(chiper, encryptionKey).toString(CryptoJS.enc.Utf8);
        const data = JSON.parse(jsonText);
        return data.value ?? default_value;
    }

    useEffect(() => {
        refetchCache();
    }, [profileName, category, key]);

    const writeValue = (value: any) => {
        if (typeof value === 'function') {
            value = value(cached);
        }
        LocalAPI.storeProfileValue(profileName, category, key, encode(value));
        setCached(value);
    };

    const refetchCache = () => {
        setCached(undefined);
        LocalAPI.loadProfileValue(profileName, category, key)
            .then(data => setCached(decode(data)));
    }

    return [cached, writeValue, refetchCache];
}