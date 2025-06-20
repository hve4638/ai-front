export const KEYCODE_MAP = {
    'Digit1': '1',
    'Digit2': '2',
    'Digit3': '3',
    'Digit4': '4',
    'Digit5': '5',
    'Digit6': '6',
    'Digit7': '7',
    'Digit8': '8',
    'Digit9': '9',
    'Digit0': '0',
    'KeyA': 'A',
    'KeyB': 'B',
    'KeyC': 'C',
    'KeyD': 'D',
    'KeyE': 'E',
    'KeyF': 'F',
    'KeyG': 'G',
    'KeyH': 'H',
    'KeyI': 'I',
    'KeyJ': 'J',
    'KeyK': 'K',
    'KeyL': 'L',
    'KeyM': 'M',
    'KeyN': 'N',
    'KeyO': 'O',
    'KeyP': 'P',
    'KeyQ': 'Q',
    'KeyR': 'R',
    'KeyS': 'S',
    'KeyT': 'T',
    'KeyU': 'U',
    'KeyV': 'V',
    'KeyW': 'W',
    'KeyX': 'X',
    'KeyY': 'Y',
    'KeyZ': 'Z',
    'Tab': 'Tab',
    'F1': 'F1',
    'F2': 'F2',
    'F3': 'F3',
    'F4': 'F4',
    'F5': 'F5',
    'F6': 'F6',
    'F7': 'F7',
    'F8': 'F8',
    'F9': 'F9',
    'F10': 'F10',
    'F11': 'F11',
    'F12': 'F12',

    'Backquote': '`',
    'Minus': '-',
    'Equal': '=',
    'BracketLeft': '[',
    'BracketRight': ']',
    'Backslash': '\\',
    'Semicolon': ';',
    'Quote': '\'',
    'Comma': ',',
    'Period': '.',
    'Slash': '/',

    'Enter': 'Enter',
    'Space': 'Space',
    'Escape': 'Esc',
    'CapsLock': 'CapsLock',
    'Backspace': 'Backspace',

    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',

    'Delete': 'Del',
    'Insert': 'Ins',
    'Home': 'Home',
    'End': 'End',
    'PageUp': 'PgUp',
    'PageDown': 'PgDn',
    'ScrollLock': 'ScrLk',
    'Pause': 'Pause',
    'PrintScreen': 'PrtSc',
} as const;

export const KEY_TYPE = {
    NUMBER : 'NUMBER',
    CHAR : 'CHAR',
    FUNCTION : 'FUNCTION',
    CONTROL : 'CONTROL',
    ARROW : 'ARROW',
    SYSTEM : 'SYSTEM',
} as const;
export type KEY_TYPE = typeof KEY_TYPE[keyof typeof KEY_TYPE];

export const KEYCODE_CATEGORY = {
    'Digit1': KEY_TYPE.NUMBER,
    'Digit2': KEY_TYPE.NUMBER,
    'Digit3': KEY_TYPE.NUMBER,
    'Digit4': KEY_TYPE.NUMBER,
    'Digit5': KEY_TYPE.NUMBER,
    'Digit6': KEY_TYPE.NUMBER,
    'Digit7': KEY_TYPE.NUMBER,
    'Digit8': KEY_TYPE.NUMBER,
    'Digit9': KEY_TYPE.NUMBER,
    'Digit0': KEY_TYPE.NUMBER,
    'KeyA': KEY_TYPE.CHAR,
    'KeyB': KEY_TYPE.CHAR,
    'KeyC': KEY_TYPE.CHAR,
    'KeyD': KEY_TYPE.CHAR, 
    'KeyE': KEY_TYPE.CHAR,
    'KeyF': KEY_TYPE.CHAR,
    'KeyG': KEY_TYPE.CHAR,
    'KeyH': KEY_TYPE.CHAR,
    'KeyI': KEY_TYPE.CHAR,
    'KeyJ': KEY_TYPE.CHAR,
    'KeyK': KEY_TYPE.CHAR,
    'KeyL': KEY_TYPE.CHAR,
    'KeyM': KEY_TYPE.CHAR,
    'KeyN': KEY_TYPE.CHAR,
    'KeyO': KEY_TYPE.CHAR,
    'KeyP': KEY_TYPE.CHAR,
    'KeyQ': KEY_TYPE.CHAR,
    'KeyR': KEY_TYPE.CHAR,
    'KeyS': KEY_TYPE.CHAR,
    'KeyT': KEY_TYPE.CHAR,
    'KeyU': KEY_TYPE.CHAR,
    'KeyV': KEY_TYPE.CHAR,
    'KeyW': KEY_TYPE.CHAR,
    'KeyX': KEY_TYPE.CHAR,
    'KeyY': KEY_TYPE.CHAR,
    'KeyZ': KEY_TYPE.CHAR,
    'Backquote': KEY_TYPE.CHAR,
    'Minus': KEY_TYPE.CHAR,
    'Equal': KEY_TYPE.CHAR,
    'BracketLeft': KEY_TYPE.CHAR,
    'BracketRight': KEY_TYPE.CHAR,
    'Backslash': KEY_TYPE.CHAR,
    'Semicolon': KEY_TYPE.CHAR,
    'Quote': KEY_TYPE.CHAR,
    'Comma': KEY_TYPE.CHAR,
    'Period': KEY_TYPE.CHAR,
    'Slash': KEY_TYPE.CHAR,
    
    'F1': KEY_TYPE.FUNCTION,
    'F2': KEY_TYPE.FUNCTION,
    'F3': KEY_TYPE.FUNCTION,
    'F4': KEY_TYPE.FUNCTION,
    'F5': KEY_TYPE.FUNCTION,
    'F6': KEY_TYPE.FUNCTION,
    'F7': KEY_TYPE.FUNCTION,
    'F8': KEY_TYPE.FUNCTION,
    'F9': KEY_TYPE.FUNCTION,
    'F10': KEY_TYPE.FUNCTION,
    'F11': KEY_TYPE.FUNCTION,
    'F12': KEY_TYPE.FUNCTION,

    'Tab': KEY_TYPE.CONTROL,
    'Enter': KEY_TYPE.CONTROL,
    'Space': KEY_TYPE.CONTROL,
    'Escape': KEY_TYPE.CONTROL,
    'CapsLock': KEY_TYPE.CONTROL,
    'Backspace': KEY_TYPE.CONTROL,

    'ArrowUp': KEY_TYPE.ARROW,
    'ArrowDown': KEY_TYPE.ARROW,
    'ArrowLeft': KEY_TYPE.ARROW,
    'ArrowRight': KEY_TYPE.ARROW,

    'Delete': KEY_TYPE.SYSTEM,
    'Insert': KEY_TYPE.SYSTEM,
    'Home': KEY_TYPE.SYSTEM,
    'End': KEY_TYPE.SYSTEM,
    'PageUp': KEY_TYPE.SYSTEM,
    'PageDown': KEY_TYPE.SYSTEM,
    'ScrollLock': KEY_TYPE.SYSTEM,
    'Pause': KEY_TYPE.SYSTEM,
    'PrintScreen': KEY_TYPE.SYSTEM,
} as const;
