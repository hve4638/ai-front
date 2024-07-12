import { useState, useEffect } from 'react';
import { storeValue, loadValue } from '../services/local/index.ts';

export function usePlainCookie(cookieName:string, defaultvalue:any=undefined):[any, (value:any, options?:any)=>void] {
  const encode = (value:any) => value
  const decode = (value:string|undefined) => value ?? defaultvalue;
  const [cached, setCached] = useState<any>(undefined);

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