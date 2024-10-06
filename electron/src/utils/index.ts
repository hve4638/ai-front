import { exec } from 'child_process';

export function throttle(interval:number) {
    let timeout:NodeJS.Timeout|null = null;

    return (callback) => {  
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                callback();
            }, interval);
        }
    };
}

export function openBrowser(url:string) {
    if (url.indexOf(".") === -1) return;

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
    exec(command);
}