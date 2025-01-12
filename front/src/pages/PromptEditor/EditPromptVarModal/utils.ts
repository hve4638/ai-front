import { PromptVar, PromptVarType } from "types/prompt-variables";

export function dropdownItem(name:string, key:string) {
    return { name, key };
}

export function initPromptVar(promptVar:PromptVar|undefined|null) {
    if (promptVar == undefined) return;

    promptVar.name ??= 'new-var';
    promptVar.display_name ??= 'New Variable';
    promptVar.type ??= PromptVarType.Text;

    switch (promptVar.type) {
        case PromptVarType.Text:
            promptVar.default_value ??= '';
            promptVar.placeholder ??= '';
            promptVar.allow_multiline ??= false;
            break;
        case PromptVarType.Number:
            promptVar.allow_decimal ??= false;
            promptVar.minimum_value ??= null;
            promptVar.maximum_value ??= null;
            break;
        case PromptVarType.Checkbox:
            promptVar.default_value ??= false;
            break;
        case PromptVarType.Select:
            promptVar.default_value ??= '';
            promptVar.options ??= [
                {
                    name: '선택 1',
                    value: 'select-1',
                }
            ];
            break;
        case PromptVarType.Struct:
            promptVar.fields ??= [];
            break;
        case PromptVarType.Array:
            promptVar.minimum_length ??= null;
            promptVar.maximum_length ??= null;
            promptVar.element ??= {
                display_name: '',
                name: '',
                type: PromptVarType.Text,
            } as any;
            initPromptVar(promptVar.element);
            break;
    }
}