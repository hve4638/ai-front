import * as path from 'node:path';

/**
 * Profile 내 Prompt 파일 경로 관리
 */
class PromptPath {
    #promptsPath:string;

    constructor(profileDirectoryPath:string) {
        this.#promptsPath = path.join(profileDirectoryPath, 'prompts');
    }
    
    /** Root PromptMetatada 반환 */
    get rootMetadata():string {
        return path.join(this.#promptsPath, 'index.json');
    }

    /** 레거시 Root PromptMetadata(list.json) 반환 */
    get legacyRootMetadata():string {
        return path.join(this.#promptsPath, 'list.json');
    }

    /** 모듈의 PromptMetadata 경로 반환 */
    getModuleMetadata(moduleName:string):string {
        return path.join(this.#promptsPath, moduleName, 'index.json');
    }

    /** 모듈의 파일 반환 */
    getFile(moduleName:string, fileName:string):string {
        return path.join(this.#promptsPath, moduleName, fileName);
    }
}

export default PromptPath;