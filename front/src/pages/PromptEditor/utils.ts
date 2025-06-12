
/**
 * PromptVar의 default_value를 type에 맞게 수정
 * 
 * @param promptVar 
 */
export function fixPromptVar(promptVar:PromptVar) {
    switch(promptVar.type) {
        case 'text':
            if (typeof promptVar.default_value !== 'string') {
                delete promptVar.default_value;
            }
            break;
        case 'number':
            if (typeof promptVar.default_value !== 'number') {
                delete promptVar.default_value;
            }
            break;
        case 'select':
            if (typeof promptVar.default_value !== 'string') {
                delete promptVar.default_value;
                // = promptVar.options[0].value;
            }
            break;
        case 'checkbox':
            if (typeof promptVar.default_value !== 'boolean') {
                promptVar.default_value = false;
            }
            break;
        case 'array':
            fixPromptVar(promptVar.element);
            break;
        case 'struct':
            for (const field of promptVar.fields) {
                fixPromptVar(field);
            }
            break;
    }
}