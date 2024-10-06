const fs = require('fs');

const {
    baseDirectoryPath,
    promptsDirectoryPath,
    profilesDirectoryPath,
} = require('./path');
const {
    migrateLegacyProfile,
} = require('./legacy');

const prompts = require('./prompts');

const requiredPaths = [
    baseDirectoryPath,
    promptsDirectoryPath,
    profilesDirectoryPath
];

/**
 * 초기 설정에 필요한 디렉토리 생성
 */
function createRequiredPath() {
    for (const requiredPath of requiredPaths) {
        fs.mkdirSync(requiredPath, { recursive: true });
    }
}

module.exports = {
    prompts,
    path : {
        baseDirectoryPath,
        promptsDirectoryPath,
        profilesDirectoryPath,
    },
    
    createRequiredPath,
    migrateLegacyProfile,
}