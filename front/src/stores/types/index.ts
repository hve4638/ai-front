export type UpdateMethods<T> = {
    [K in keyof T]: (value: T[K]) => Promise<void>;
}
