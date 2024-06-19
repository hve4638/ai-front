// 사용하기위해 CookiesProvider로 감싸야 한다
import {Cookies} from 'react-cookie';

const cookies = new Cookies();

export const setCookie:(name:string, value:string, options?:any)=>void = (name, value, options) => {
 	return cookies.set(name, value, {...options}); 
}

export const getCookie:(x:string)=>string|undefined = (name: string) => {
    return cookies.get(name);
}

export function removeCookie(name: string) {
    cookies.remove(name);
}

export function getCookies() {
    const cookieString = document.cookie;
    const cookieArray = cookieString.split('; ');
    const cookies:string[] = [];

    cookieArray.forEach(cookie => {
        const [name, _] = cookie.split('=');
        cookies.push(name);
    });

    return cookies;
}