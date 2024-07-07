import { useState, useEffect } from 'react';
import { storeValue, loadValue } from '../services/local/index.ts';

export const usePlainCookie:(cookieName:string, defaultvalue?:any)=>[any, (value:any, options?:any)=>void]
 = (cookieName, defaultvalue=undefined) => {
  const encode = (value:any) => value
  const decode = (value:string|undefined) => value ?? defaultvalue;
  const [cached, setCached] = useState<any>(null);
  //decode(getCookie(cookieName))

  useEffect(() => {
    loadValue(cookieName)
    .then(data=>setCached(decode(data)));
  }, [ cookieName ]);

  const writeCookie = (value:any, options?:any) => {
    storeValue(cookieName, encode(value));
    setCached(value);
  };

  return [cached, writeCookie];
};