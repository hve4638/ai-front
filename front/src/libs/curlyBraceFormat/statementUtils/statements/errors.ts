import { StatementElementHint } from './interface'

export class StatementError extends Error {
    error:Error;
    hint?:StatementElementHint;

    constructor(error:Error, hint?:StatementElementHint) {
        super('');
        this.name = 'StatementError';
        this.error = error;
        this.hint = hint;
    }
}