class PromptVarParser {
    private static parseText(promptVar:PromptVarText):RTFormText {
        return {
            default_value : promptVar.default_value || '',
            placeholder : promptVar.placeholder ?? '',
            allow_multiline : promptVar.allow_multiline ?? false,
        }
    }
    private static parseNumber(promptVar:PromptVarNumber):RTFormNumber {
        return {
            default_value : promptVar.default_value || 0,
            minimum_value : promptVar.minimum_value,
            maximum_value : promptVar.maximum_value,
            allow_decimal : promptVar.allow_decimal ?? false,
        }
    }
    private static parseCheckbox(promptVar:PromptVarCheckbox):RTFormCheckbox {
        return {
            default_value : promptVar.default_value || false,
        }
    }
    private static parseSelect(promptVar:PromptVarSelect):RTFormSelect {
        return {
            default_value : promptVar.default_value || '',
            options : promptVar.options.map((item)=>({
                name : item.name,
                value : item.value,
            })),
        }
    }
    private static parseStruct(promptVar:PromptVarStruct):RTFormStruct {
        const fields = promptVar.fields.map(
            (field)=>{
                const subform:RTFormStructField = {
                    type : field.type as 'text' | 'number' | 'checkbox' | 'select',
                    name : field.name,
                    display_name : field.display_name,
                    config : {},
                };

                switch(field.type) {
                    case 'text':
                        subform.config.text = this.parseText(field);
                        break;
                    case 'number':
                        subform.config.number = this.parseNumber(field);
                        break;
                    case 'checkbox':
                        subform.config.checkbox = this.parseCheckbox(field);
                        break;
                    case 'select':
                        subform.config.select = this.parseSelect(field);
                        break;
                }
                return subform;
            }
        );
        
        return { fields };
    }
    private static parseArray(promptVar:PromptVarArray):RTFormArray {
        const arrayConfig:RTFormArray = {
            element_type : promptVar.element.type,
            minimum_length : promptVar.minimum_length,
            maximum_length : promptVar.maximum_length,
            config : {}
        }

        switch (promptVar.element.type) {
            case 'text':
                arrayConfig.config.text = this.parseText(promptVar.element);
                break;
            case 'number':
                arrayConfig.config.number = this.parseNumber(promptVar.element);
                break;
            case 'checkbox':
                arrayConfig.config.checkbox = this.parseCheckbox(promptVar.element);
                break;
            case 'select':
                arrayConfig.config.select = this.parseSelect(promptVar.element);
                break;
            case 'struct':
                arrayConfig.config.struct = this.parseStruct(promptVar.element);
                break;
        }
        
        return arrayConfig;
    }
    
    static toRTForm(promptVar:PromptVar):RTForm {
        if (promptVar.id == null) {
            throw new Error('PromptVar id is null');
        }

        const form:RTForm = {
            type : promptVar.type,
            id : promptVar.id,
            display_name : promptVar.display_name,
            display_on_header : false,
            
            config : {}
        }
        
        switch (promptVar.type) {
            case 'text':
                form.config.text = this.parseText(promptVar);
                break;
            case 'number':
                form.config.number = this.parseNumber(promptVar);
                break;
            case 'checkbox':
                form.config.checkbox = this.parseCheckbox(promptVar);
                break;
            case 'select':
                form.config.select = this.parseSelect(promptVar);
                break;
            case 'struct':
                form.config.struct = this.parseStruct(promptVar);
                break;
            case 'array':
                form.config.array = this.parseArray(promptVar);
                break;
        }
        return form;
    }
}

export default PromptVarParser;