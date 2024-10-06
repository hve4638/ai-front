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

export class NoContextProviderError extends Error {
    constructor(contextProviderName?:string) {
        let message;
        if (contextProviderName) {
            message = 'No context provider found: ' + contextProviderName;
        }
        else {
            message = 'No context provider found';
        }
        
        super(message);
        this.name = 'NoContextProviderError';
    }
}