import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {setCookie, getCookie} from '../libs/cookies.tsx'
import CryptoJS from 'crypto-js';

export const useObjectCookie:(cookieName:string, defaultvalue?:any)=>[any, (value:any, options?:any)=>void]
 = (cookieName, defaultvalue=undefined) => {
  const [cached, setCached] = useState<any>(getCookie(cookieName));

  const encode = (value:any) => {
    try {
      console.log('ENCODE')
      console.log([value]);
      return JSON.stringify([value])
    }
    catch {
      return '';
    }
  }
  const decode = (x:string|undefined) => {
    if (x == undefined) {
      return defaultvalue;
    }
    else {
      try {
        const value = JSON.parse(x);
        console.log('DECODE')
        console.log(value);
        return value;
      }
      catch {
        return defaultvalue;
      }
    }
  }

  useEffect(() => {
    const value = getCookie(cookieName);
    setCached(decode(value));
  }, [ cookieName ]);

  const writeCookie = (value:any, options?:any) => {
    setCookie(cookieName, encode(value), options);
    setCached(value);
  };

  return [cached, writeCookie];
};