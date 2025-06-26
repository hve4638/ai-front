import { CBFResult, PromptGenerator } from '@hve/prompt-template';
import { ChatContents } from '../nodes/types';
import FilesPromptGenerator from './FilesPromptGenerator';
import { parseInputFileToCBFResult } from './utils';

interface InputPromptGeneratorProps {
    text: string;
    files?: InputFile[];
}

class InputPromptGenerator extends PromptGenerator {
    #text: string;
    #files: InputFile[];
    #filesGenerator: FilesPromptGenerator;

    constructor({ text, files = [] }: InputPromptGeneratorProps) {
        const fileGenerator = new FilesPromptGenerator(files);
        super(function* () {
            for (const file of files) {
                yield parseInputFileToCBFResult(file);
            }
            yield {
                type: 'TEXT',
                text: text,
            };
        })

        this.#text = text;
        this.#files = files;
        this.#filesGenerator = fileGenerator;
    }

    get text(): string {
        return this.#text;
    }

    get files(): FilesPromptGenerator {
        return this.#filesGenerator;
    }
}

export default InputPromptGenerator;