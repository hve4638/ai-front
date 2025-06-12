export function dropdownItem(name:string, key:string) {
    return { name, key };
}

export function initPromptVar(promptVar:PromptVar|undefined|null) {
    if (promptVar == undefined) return;

    promptVar.name ??= 'new-var';
    promptVar.display_name ??= 'New Variable';
    promptVar.type ??= 'text';

    switch (promptVar.type) {
        case 'text':
            promptVar.default_value ??= '';
            promptVar.placeholder ??= '';
            promptVar.allow_multiline ??= false;
            break;
        case 'number':
            promptVar.allow_decimal ??= false;
            break;
        case 'checkbox':
            promptVar.default_value ??= false;
            break;
        case 'select':
            promptVar.default_value ??= '';
            promptVar.options ??= [
                {
                    name: '선택 1',
                    value: 'select-1',
                }
            ];
            break;
        case 'struct':
            promptVar.fields ??= [];
            break;
        case 'array':
            promptVar.element ??= {
                display_name: '',
                name: '',
                type: 'text',
            } as any;
            initPromptVar(promptVar.element);
            break;
    }
}