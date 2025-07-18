export type VarFormProps<T> = {
    form : PromptVar;
    onChange : (value: T) => void;
    value : T;
}

