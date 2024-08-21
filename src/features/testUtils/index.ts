class ExpectedButNotThrownError extends Error {
    constructor() {
        super('Expected error but not thrown');
    }
}

export function handleAndGetError(callback) {
    try {
        callback();
        
        throw new ExpectedButNotThrownError();
    }
    catch(e:any) {
        return e;
    }
}