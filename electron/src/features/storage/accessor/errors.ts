export class AccessorError extends Error {
    constructor(message:string) {
        super(message);
        this.name = 'AccessorError';
    }
}