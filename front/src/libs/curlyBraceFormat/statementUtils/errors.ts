export class BuildError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BuildError';
    }
}

export class BranchError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BranchError';
    }
}

export class UnexpectedEndError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnexpectedEndError';
    }
}