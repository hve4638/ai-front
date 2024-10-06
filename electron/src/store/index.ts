import * as fs from 'fs';
export * as prompts from './prompts';
import {
    baseDirectoryPath,
    promptsDirectoryPath,
    profilesDirectoryPath,
} from './path';

export { migrateLegacyProfile } from './legacy';

/** 초기 설정에 필요한 디렉토리 생성 */
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
} as const;