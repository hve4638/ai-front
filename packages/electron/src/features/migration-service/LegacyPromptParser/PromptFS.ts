import fs from 'fs';
import path from 'path';
import {
    PROMPT_DIR_PATH
} from '../data';

class PromptFS {
    static async loadPromptTemplate(filename: string, basePath: string = '') {
        let fullPath: string;
        if (basePath === '') {
            fullPath = filename;
        }
        else {
            fullPath = basePath + '/' + filename;
        }

        const banPatterns = ["../", "./", "..", "~", "//"];
        for (const pattern of banPatterns) {
            if (fullPath.includes(pattern)) {
                return "@FAIL - INVALID PATH";
            }
        }

        const targetPath = path.join(PROMPT_DIR_PATH, fullPath);
        if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
            return fs.readFileSync(targetPath, 'utf8');
        }
        else {
            return "@FAIL - FILE NOT FOUND";
        }
    }

    static async readPromptMetadata(pathString: string) {
        const banPatterns = ["../", "./", "..", "~", "//"];
        for (const pattern of banPatterns) {
            if (pathString.includes(pattern)) {
                return '@FAIL - INVALID PATH';
            }
        }

        const targetPath = path.join(PROMPT_DIR_PATH, pathString);
        if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
            return fs.readFileSync(targetPath, 'utf8');
        }
        else {
            return '@FAIL - FILE NOT FOUND';
        }
    }


}

export default PromptFS;