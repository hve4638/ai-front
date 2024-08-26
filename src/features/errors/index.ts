export class LogicError extends Error {
    constructor(message:string='') {
        super(message);
        this.name = 'LogicError';
    }
}

export class NotImplementedError extends Error {
    constructor(message:string='') {
        super(message);
        this.name = 'NotImplementedError';
    }
}

