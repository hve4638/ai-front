const { exec } = require('child_process');

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

module.exports = {
    throttle : throttle,
    openBrowser : openBrowser
}