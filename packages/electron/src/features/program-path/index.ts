import * as fs from 'fs';
export * as prompts from './prompts';
import {
    baseDirectoryPath,
    promptsDirectoryPath,
    profilesDirectoryPath,
    testDirectoryPath
} from './path';
import ProgramPath from './ProgramPath';
export { migrateLegacyProfile } from './legacy';

/** 필수 디렉토리 생성 */
export function createRequiredPath() {
    const requiredPaths = [
        baseDirectoryPath,
        promptsDirectoryPath,
        profilesDirectoryPath
    ];
    
    for (const requiredPath of requiredPaths) {
        fs.mkdirSync(requiredPath, { recursive: true });
    }
}

export const aiFrontPath = {
    baseDirectoryPath,
    promptsDirectoryPath,
    profilesDirectoryPath,
    testDirectoryPath
} as const;

export default ProgramPath;