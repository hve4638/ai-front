import { Shortcut } from "types/shortcut";
import { mapKeyCode } from "./keycode-map";

export function shortcutToText(shortcut: Shortcut): string {
    let text = '';
    if (shortcut.ctrl) text += 'Ctrl + ';
    if (shortcut.shift) text += 'Shift + ';
    if (shortcut.alt) text += 'Alt + ';
    if (shortcut.win) text += 'Win + ';
    if (shortcut.key) {
        const key = mapKeyCode(shortcut.key);
        if (key) text += key;
        else text += shortcut.key;
    }
    else if (shortcut.wheel) text += `Wheel ${shortcut.wheel > 0 ? 'DOWN' : 'UP'}`;
    else if (shortcut.click) text += `Click ${shortcut.click}`;

    return text.toUpperCase();
}