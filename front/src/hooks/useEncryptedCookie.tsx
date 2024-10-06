import { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import LocalAPI from 'api'

const makeSalt = () => Math.floor(Math.random() * 1000000);

export const useEncryptedCookie: (cookieName: string, encryptionKey: string) => [any, (value: any, options?: any) => void] = (cookieName, encryptionKey) => {
    const [cached, setCached] = useState<any>(undefined);

    const encrypt: (x: any) => string = (plain) => {
        const obj = {
            value: plain,
            salt: makeSalt()
        }
        return CryptoJS.AES.encrypt(JSON.stringify(obj), encryptionKey).toString();
    }
    const decrypt: (x: string) => any = (chiper) => {
        const jsontext = CryptoJS.AES.decrypt(chiper, encryptionKey).toString(CryptoJS.enc.Utf8);
        const obj = JSON.parse(jsontext);
        return obj.value;
    }

    useEffect(() => {
        LocalAPI.loadSecretValue(cookieName)
            .then(encrypted => {
                if (encrypted && !cached) {
                    try {
                        const decrypted = decrypt(encrypted);
                        setCached(decrypted);
                    } catch (error) {
                        console.error('Failed to decrypt cookie:', error);
                    }
                }
            })
    }, [cookieName, cached]);

    const setEncryptedCookie = (value, options) => {
        try {
            const encryptedValue = encrypt(value);
            LocalAPI.storeSecretValue(cookieName, encryptedValue);
            setCached(value);
        } catch (error) {
            console.error('Failed to encrypt cookie value:', error);
        }
    };

    return [cached, setEncryptedCookie];
};