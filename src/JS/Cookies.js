import { Cookies } from 'react-cookie';

const cookies = new Cookies()

export const setCookie = (name, value) => cookies.get(name, value);
export const getCookie = (name) => cookies.get(name);