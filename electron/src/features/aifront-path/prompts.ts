import * as fs from 'node:fs';
import { promptPath } from './path';

export function getRootMetadata() {
    const targetPath = promptPath.getRootIndex();
    if (fs.existsSync(targetPath)) {
        const data = fs.readFileSync(targetPath, 'utf8');
        return JSON.parse(data);
    }
    else {
        const legacyTargetPath = promptPath.getLegacyRootIndex();
        const data = fs.readFileSync(legacyTargetPath, 'utf8');
        return JSON.parse(data);
    }
}
export function getMetadata(moduleName) {
    const targetPath = promptPath.getModuleIndex(moduleName);
    const data = fs.readFileSync(targetPath, 'utf8');
    return JSON.parse(data);
}
export function getFileAsString(basePath, targetPath) {
    const target = promptPath.get(basePath, targetPath);
    return fs.readFileSync(target, 'utf8');
}

module.exports = {
    getRootMetadata,
    getMetadata,
    getFileAsString,
}