import { useState, useEffect } from 'react';
import {setCookie, getCookie} from '../libs/cookies.tsx'

export const usePlainCookie:(cookieName:string, defaultvalue?:any)=>[any, (value:any, options?:any)=>void]
 = (cookieName, defaultvalue=undefined) => {
  const encode = (value:any) => value
  const decode = (value:string|undefined) => value ?? defaultvalue;
  const [cached, setCached] = useState<any>(decode(getCookie(cookieName)));

  useEffect(() => {
    const decoded = getCookie(cookieName);
    setCached(decoded);
  }, [ cookieName ]);

  const writeCookie = (value:any, options?:any) => {
    setCookie(cookieName, encode(value), options);
    setCached(value);
  };

  return [cached, writeCookie];
};