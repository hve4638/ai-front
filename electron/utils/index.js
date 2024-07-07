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
    case 'darwin': // macOS
        command = `open ${url}`;
        break;
    case 'win32': // Windows
        command = `start ${url}`;
        break;
    case 'linux': // Linux
        command = `xdg-open ${url}`;
        break;
    default:
        return;
    }
    console.log("shell : " + command)
    exec(command);
}

module.exports = {
    throttle : throttle,
    openBrowser : openBrowser
}