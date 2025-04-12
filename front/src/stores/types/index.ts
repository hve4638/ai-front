export type UpdateMethods<T> = {
    [K in keyof T]: (value: T[K]|((prev:T[K])=>T[K])) => Promise<void>;
}

export type RefetchMethods<T> = {
    [K in keyof T]: () => Promise<void>;
}


export type ActionMethods<T> = {
    [K in keyof T]: () => Promise<void>;
}