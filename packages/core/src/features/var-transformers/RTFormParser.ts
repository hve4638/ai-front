class RTFormParser {
    private static parseText(base:BasePromptVar, config: RTFormText):PromptVarText {
        return {
            ...base,
            type : 'text',
            default_value : config.default_value ?? '',
            placeholder : config.placeholder ?? '',
            allow_multiline : config.allow_multiline ?? '',
        };
    }
    private static parseNumber(base:BasePromptVar, config: RTFormNumber):PromptVarNumber {
        return {
            ...base,
            type : 'number',
            default_value : config.default_value ?? 0,
            minimum_value : config.minimum_value,
            maximum_value : config.maximum_value,
            allow_decimal : config.allow_decimal ?? false,
        };
    }
    private static parseCheckbox(base:BasePromptVar, config: RTFormCheckbox):PromptVarCheckbox {
        return {
            ...base,
            type : 'checkbox',
            default_value : config.default_value ?? false,
        } as PromptVarCheckbox;
    }
    private static parseSelect(base:BasePromptVar, config: RTFormSelect):PromptVarSelect {
        return {
            ...base,
            type : 'select',
            default_value : config.default_value ?? '',
            options : config.options.map((item)=>({
                name : item.name,
                value : item.value,
            })),
        }
    }
    private static parseStruct(base:BasePromptVar, config: RTFormStruct):PromptVarStruct {
        const fields = config.fields.map((field)=>{
            const subPromptVar:BasePromptVar = {
                id : field.name,
                name : field.name,
                display_name : field.display_name,
            };

            switch(field.type) {
                case 'text':
                    return this.parseText(subPromptVar, field.config.text!);
                case 'number':
                    return this.parseNumber(subPromptVar, field.config.number!);
                case 'checkbox':
                    return this.parseCheckbox(subPromptVar, field.config.checkbox!);
                case 'select':
                    return this.parseSelect(subPromptVar, field.config.select!);
                default:
                    throw new Error(`Unsupported field type: ${field.type}`);
            }
        });

        return {
            ...base,
            type : 'struct',
            fields : fields,
        }
    }
    private static parseArray(base:BasePromptVar, config: RTFormArray):PromptVarArray {
        let elementBase:BasePromptVar = {
            name : '',
            display_name : '',
        };
         
        let element:Exclude<PromptVar, PromptVarArray>;
        switch(config.element_type) {
            case 'text':
                element = this.parseText(elementBase, config.config.text!);
                break;
            case 'number':
                element = this.parseNumber(elementBase, config.config.number!);
                break;
            case 'checkbox':
                element = this.parseCheckbox(elementBase, config.config.checkbox!);
                break;
            case 'select':
                element = this.parseSelect(elementBase, config.config.select!);
                break;
            case 'struct':
                element = this.parseStruct(elementBase, config.config.struct!);
                break;
            default:
                throw new Error(`Unsupported array element type: ${config.element_type}`);
        }

        return {
            ...base,
            type : 'array',
            element : element,
            minimum_length : config.minimum_length,
            maximum_length : config.maximum_length,
        }
    }

    static toPromptVar(form:RTForm):PromptVar {
        const base:BasePromptVar = {
            id : form.id,
            name : '', 
            display_name : form.display_name,
        }

        switch(form.type) {
            case 'text':
                return this.parseText(base, form.config.text!);
            case 'number':
                return this.parseNumber(base, form.config.number!);
            case 'checkbox':
                return this.parseCheckbox(base, form.config.checkbox!);
            case 'select':
                return this.parseSelect(base, form.config.select!);
            case 'struct':
                return this.parseStruct(base, form.config.struct!);
            case 'array':
                return this.parseArray(base, form.config.array!);
        }
    }
}

export default RTFormParser;