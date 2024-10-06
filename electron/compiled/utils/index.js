"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = throttle;
exports.openBrowser = openBrowser;
const child_process_1 = require("child_process");
function throttle(interval) {
    let timeout = null;
    return (callback) => {
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                callback();
            }, interval);
        }
    };
}
function openBrowser(url) {
    if (url.indexOf(".") === -1)
        return;
    let command;
    switch (process.platform) {
        case 'darwin':
            command = `open ${url}`;
            break;
        case 'win32':
            command = `start ${url}`;
            break;
        case 'linux':
            command = `xdg-open ${url}`;
            break;
        default:
            return;
    }
    (0, child_process_1.exec)(command);
}
