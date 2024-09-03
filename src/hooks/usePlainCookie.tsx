import { useState, useEffect } from 'react';
import { storeValue, loadValue, LocalInteractive } from 'services/local';

/**
 * WEB 환경이라면 Cookie에 값이 저장된다.
 * Electron 환경이라면 config.json에 값이 저장된다.
 * @param cookieName 
 * @param defaultvalue 
 * @returns 
 */
export function usePlainCookie(cookieName: string, defaultvalue: any = undefined): [any, (value: any, options?: any) => void] {
    const encode = (value: any) => value
    const decode = (value: string | undefined) => value ?? defaultvalue;
    const [cached, setCached] = useState<any>(undefined);

    useEffect(() => {
        LocalInteractive.loadValue(cookieName)
            .then(data => setCached(decode(data)));
    }, [cookieName]);

    const writeCookie = (value: any, options?: any) => {
        LocalInteractive.storeValue(cookieName, encode(value));
        setCached(value);
    };

    return [cached, writeCookie];
};