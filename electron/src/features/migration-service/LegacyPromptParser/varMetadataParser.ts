import { PROMPT_VAR_TYPE } from './data';
import { VarMetadataError } from './errors';
import type {
    BaseVarMetadata,
    IPromptMetadata,
    RawPromptMetadata,
    RawVarMetadata,
    SelectVarMetadata,
    ArrayVarMetadata,
    StructVarMetadata,
    ImageVarMetadata,
    LiteralVarMetadata,
    SelectItem,
    Selects,
    VarMetadata,
    NestableVarMetadata,
    RawArrayElementMetadata,
    ArrayElementMetadata
} from './types'


export class VarMetadataParser {
    #selectRef: Selects;

    constructor(selectRef: Selects) {
        this.#selectRef = selectRef;
    }

    parse(raw: RawVarMetadata): VarMetadata {
        let target = { ...raw };

        return {
            ...this.#getBase(target),
            ...this.#parseByType(target)
        } as VarMetadata;
    }

    #parseByType(target:RawVarMetadata):Partial<VarMetadata> {
        switch (target.type) {
            case PROMPT_VAR_TYPE.BOOLEAN:
            case PROMPT_VAR_TYPE.NUMBER:
            case PROMPT_VAR_TYPE.TEXT:
            case PROMPT_VAR_TYPE.TEXT_MULTILINE:
                return this.#parseAsPrimitive(target);
            case PROMPT_VAR_TYPE.SELECT:
                return this.#parseAsSelect(target);
            case PROMPT_VAR_TYPE.STRUCT:
                return this.#parseAsStruct(target);
            case PROMPT_VAR_TYPE.ARRAY:
                return this.#parseAsArray(target);
            default:
                throw new VarMetadataError(`Invalid variable type: ${target.type}`);
        }
    }

    #getBase(target:RawVarMetadata):Omit<BaseVarMetadata, 'default_value'> {
        return {
            type : target.type,
            name : target.name,
            display_name : target.display_name ?? target.name,
            show_in_header : target.show_in_header ?? false,
        };
    }

    #parseAsPrimitive(target:RawVarMetadata):Partial<VarMetadata> {
        return {
            default_value : this.#getDefaultValue(target),
        };
    }

    #parseAsSelect(target:RawVarMetadata):Partial<SelectVarMetadata> {
        if (target.select_ref && target.options) {
            throw new VarMetadataError(
                "'select_ref' and 'options' cannot both be specified"
            );
        }
        else if (target.select_ref) {
            target.options = this.#derefSelectRef(target.select_ref);
        }
        else if (!target.options) {
            throw new VarMetadataError('no options');
        }

        return {
            options: target.options,
            default_value : this.#getDefaultValue(target),
        };
    }

    #derefSelectRef(refname: string): SelectItem[] {
        const selectItems = this.#selectRef[refname];
        if (selectItems == null) {
            throw new VarMetadataError(`selects not found: ${refname}`);
        }
        return selectItems;
    }
    #getDefaultValue(target:RawVarMetadata):any {
        if (target.default_value) {
            return target.default_value;
        }

        switch (target.type) {
            case PROMPT_VAR_TYPE.SELECT:
                if (!target.options) {
                    throw new VarMetadataError(`no options : ${target.name}`);
                }
                if (target.options.length === 0) {
                    throw new VarMetadataError(`option is empty : ${target.name}`);
                }
                return target.options[0].value;
            case PROMPT_VAR_TYPE.TEXT:
            case PROMPT_VAR_TYPE.TEXT_MULTILINE:
                return "";
            case PROMPT_VAR_TYPE.ARRAY:
                return [];
            case PROMPT_VAR_TYPE.IMAGE:
                return null;
            case PROMPT_VAR_TYPE.BOOLEAN:
                return false;
            case PROMPT_VAR_TYPE.NUMBER:
                return 0;
            case PROMPT_VAR_TYPE.STRUCT:
            {
                if (target.fields == null) {
                    throw new Error('Logic Error');
                }
                
                const result:{[key:string]:any} = {};
                for (const field of target.fields) {
                    result[field.name] = this.#getDefaultValue(field);
                }
                return result;
            }
        }
    }

    #parseAsStruct(target:RawVarMetadata):Partial<StructVarMetadata> {
        if (target.fields == null) {
            throw new VarMetadataError("'fields' is required for struct type");
        }

        const fields:NestableVarMetadata[] = [];
        for (const field of target.fields) {
            switch(field.type) {
                case PROMPT_VAR_TYPE.ARRAY:
                case PROMPT_VAR_TYPE.STRUCT:
                    throw new VarMetadataError(
                        `${field.type} type is not allowed in struct fields`
                    );
                default:
                    // pass
            }

            const fieldMetadata = this.parse(field) as NestableVarMetadata;
            fieldMetadata.show_in_header = false;
            fields.push(fieldMetadata);
        }
        target.fields = fields;

        return {
            fields : fields,
            default_value : this.#getDefaultValue(target),
        };
    }

    #parseAsArray(target:RawVarMetadata):Partial<ArrayVarMetadata> {
        if (target.element == null) {
            throw new VarMetadataError("'element' is required for array type");
        }

        switch(target.element.type) {
            case PROMPT_VAR_TYPE.ARRAY:
                throw new VarMetadataError(
                    `${target.element.type} type is not allowed in array element`
                );
        }
        
        return {
            element : this.#parseArrayElement(target.element),
            default_value : [],
        } as ArrayVarMetadata;
    }

    #parseArrayElement(element:RawArrayElementMetadata):ArrayElementMetadata {
        let target = { ...element };
        return {
            type : target.type,
            ...this.#parseByType(target as VarMetadata)
        } as ArrayElementMetadata;
    }
}