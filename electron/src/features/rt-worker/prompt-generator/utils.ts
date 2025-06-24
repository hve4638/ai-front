import { CBFResult } from '@hve/prompt-template';

export function parseInputFileToCBFResult(file: InputFile): CBFResult {
    switch (file.type) {
        case 'text/plain':
        case 'application/pdf':
            return {
                type: 'FILE',
                filename: file.filename,
                data: file.data,
                dataType: file.type,
            }
            break;
        case 'image/png':
        case 'image/jpeg':
        case 'image/webp':
            return {
                type: 'IMAGE',
                filename: file.filename,
                data: file.data,
                dataType: file.type,
            }
            break;
        default:
            throw new Error(`Unsupported file type: ${file.type}`);
    }
}