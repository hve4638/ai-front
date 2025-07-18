import { KEYCODE_CATEGORY, KEYCODE_MAP, KEY_TYPE } from './data';
export { KEY_TYPE } from './data';

export function mapKeyCode(code:string) {
    return KEYCODE_MAP[code];
}

export function isKeyCodeChar(code:string) {
    return KEYCODE_CATEGORY[code] === KEY_TYPE.CHAR;
}

export function getKeyType(code:string):KEY_TYPE {
    return KEYCODE_CATEGORY[code];
}