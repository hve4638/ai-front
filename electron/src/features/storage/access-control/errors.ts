import { StorageError } from '../errors';

export class StorageAccessError extends StorageError {
    constructor(message:string) {
        super(message);
        this.name = 'StorageAccessError';
    }
}

export class NotRegisterError extends StorageError {
    constructor(message:string) {
        super(message);
        this.name = 'NotRegisteredError';
    }
}

export class AccessDeniedError extends StorageError {
    constructor(message:string) {
        super(message);
        this.name = 'AccessDeniedError';
    }
}

export class DirectoryAccessError extends StorageError {
    constructor(message:string) {
        super(message);
        this.name = 'DirectoryAccessError';
    }
}