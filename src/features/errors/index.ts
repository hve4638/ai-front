export class LogicError extends Error {
    constructor(message:string='') {
        super(message);
        this.name = 'LogicError';
    }
}