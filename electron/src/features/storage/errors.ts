export class StorageError extends Error {
    constructor(message:string) {
        super(message);
        this.name = 'StorageError';
    }
}
export class StorageAccessError extends Error {
    constructor(message:string) {
        super(message);
        this.name = 'StorageAccessError';
    }
}