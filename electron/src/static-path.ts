import * as path from 'node:path';

const FAVICON = path.join(__dirname, '../static/favicon.ico');
const STATIC_ENTRYPOINT = path.join(__dirname, '../static/index.html');
const PRELOAD = path.join(__dirname, 'preload.js');

export {
    FAVICON,
    PRELOAD,
    STATIC_ENTRYPOINT,
}
