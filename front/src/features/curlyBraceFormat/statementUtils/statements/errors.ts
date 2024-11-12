import { StatementElementHint } from './interface'

export class StatementError extends Error {
    error:Error;
    hint?:StatementElementHint|null;

    constructor(error:Error, hint?:StatementElementHint|null) {
        super('');
        this.name = 'StatementError';
        this.error = error;
        this.hint = hint as null;
    }
}