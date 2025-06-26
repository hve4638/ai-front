import { CBFResult, PromptGenerator } from '@hve/prompt-template';
import { parseInputFileToCBFResult } from './utils';

class FilePromptGenerator extends PromptGenerator {
    #file: InputFile;

    constructor(file: InputFile) {
        super(function* () {
            yield parseInputFileToCBFResult(file);
        })

        this.#file = file;
    }

    get type() {
        return this.#file.type;
    }
}

export default FilePromptGenerator;