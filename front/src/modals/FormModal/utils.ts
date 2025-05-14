
export function getPromptVarDefaultValue(promptVar: PromptVar) {
    switch (promptVar.type) {
        case 'text':
        case 'number':
        case 'select':
        case 'checkbox':
            return promptVar.default_value;
        case 'array':
            return [];
        case 'struct':
            {
                const fields = {};
                for (const field of promptVar.fields) {
                    fields[field.id!] = getPromptVarDefaultValue(field);
                }
                return fields;
            }
    }
}