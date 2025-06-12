declare global {
    type EError = { name:string, message:string, [key:string]:any };
    
    type EResult<T> = Promise<readonly [EError] | readonly [null, T]>;

    type ENoResult = Promise<readonly [EError | null]>;
}

export {};