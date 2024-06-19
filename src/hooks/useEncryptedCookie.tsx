import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {setCookie, getCookie} from '../libs/cookies.tsx'
import CryptoJS from 'crypto-js';

const makeSalt = () => Math.floor(Math.random() * 1000000);

export const useEncryptedCookie:(cookieName:string, encryptionKey:string)=>[any, (value:any, options?:any)=>void] = (cookieName, encryptionKey) => {
  const [cached, setCached] = useState<any>(undefined);

  const encrypt:(x:any)=>string = (plain) => {
    const obj = {
      value : plain,
      salt : makeSalt()
    }
    return CryptoJS.AES.encrypt(JSON.stringify(obj), encryptionKey).toString();
  }
  const decrypt:(x:string)=>any = (chiper) => {
    const jsontext = CryptoJS.AES.decrypt(chiper, encryptionKey).toString(CryptoJS.enc.Utf8);
    const obj = JSON.parse(jsontext);
    return obj.value;
  }

  useEffect(() => {
    const encrypted = getCookie(cookieName);

    if (encrypted && !cached) {
      try {
        const decrypted = decrypt(encrypted);

        setCached(decrypted);
      } catch (error) {
        console.error('Failed to decrypt cookie:', error);
      }
    }
  }, [ cookieName, cached ]);

  const setEncryptedCookie = (value, options) => {
    try {
      const encryptedValue = encrypt(value);
      setCookie(cookieName, encryptedValue, options);
      setCached(value);
    } catch (error) {
      console.error('Failed to encrypt cookie value:', error);
    }
  };

  return [cached, setEncryptedCookie];
};