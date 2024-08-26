import { LocalInteractive } from 'services/local';
import { PROMPT_VAR_TYPE } from './data';
import { PromptMetadataError, PromptTemplateLoadError, StructVerifyFailedError } from './errors';
import type {
    RawPromptMetadata,
    SelectRef,
    VarMetadata
} from './types'

type PromptMetadataArgs = {
    basePath:string;
    selectRef:SelectRef;
    //bantype:typeof PROMPT_VAR_TYPE[keyof typeof PROMPT_VAR_TYPE][];
    //bantypeReason:string;
}

export class PromptMetadata {
    #raw:RawPromptMetadata;
    #promptTemplate?:string = undefined;
    #name:string = '';
    #display_name:string = '';
    #key:string = '';
    #path:string = '';
    #basePath:string = '';
    #varMetadata:VarMetadata[] = [];
    #showInHeaderVarMetadata:VarMetadata[] = [];
    #vars:{[key:string]:any} = {};
    #parentScopeSelectRef:SelectRef;
    #externalIndex:[number, number] = [-1, -1];

    constructor(
        raw: RawPromptMetadata,
        { basePath, selectRef }: PromptMetadataArgs,
    ) {
        this.#verify(raw);
        
        this.#raw = raw;
        this.#basePath = basePath;
        this.#parentScopeSelectRef = selectRef;

        this.#name = raw.name;
        this.#display_name = raw.display_name ?? raw.name;
        this.#key = raw.key;
        this.#path = raw.path ?? raw.value ?? '';
        if (this.#path === '') {
            throw new PromptMetadataError('PromptMetadata: path is required', raw);
        }

        if (raw.vars != null) {
            for (const data of raw.vars) {
                let varMetadata:VarMetadata;

                if (typeof data === 'string') { // 과거 프롬프트 포맷 호환성
                    varMetadata = {
                        type: 'select',
                        name: data,
                        display_name: data,
                        default_value: '',
                        selectref: data,
                    };
                }
                else {
                    varMetadata = data;
                }
                varMetadata = this.#processVarMetadata(varMetadata);
                if (varMetadata.show_in_header) {
                    this.#showInHeaderVarMetadata.push(varMetadata);
                }
                this.#varMetadata.push(varMetadata);
                
                this.#vars[varMetadata.name] = varMetadata.default_value;
            }
        }
    }

    #verify(data:RawPromptMetadata) {
        const missing = (field) => {
            return new StructVerifyFailedError(`missing field : ${field}`, data);
        }

        if (!('key' in data)) throw missing('key');
        if (!('name' in data)) throw missing('name');
        if (!('path' in data || 'value' in data)) throw missing('path');
    }

    #processVarMetadata(varMetadata:VarMetadata) {
        const result:VarMetadata = { ...varMetadata };

        if (varMetadata.type === PROMPT_VAR_TYPE.SELECT && varMetadata.selectref && !varMetadata.options) {
            if (varMetadata.options != null) {
                throw new PromptMetadataError(
                    "'selectref' and 'options' cannot both be specified",
                    this.#raw
                );
            }

            // @ts-ignore
            result.options = this.#derefSelectRef(varMetadata.selectref);
        }
        result.show_in_header ??= false;
        result.display_name = varMetadata.display_name ?? varMetadata.name;
        result.default_value = varMetadata.default_value ?? this.#getDefaultValue(varMetadata);

        return result;
    }
    
    #derefSelectRef(refname:string) {
        if (this.#raw.selectref != null) {
            for (const key in this.#raw.selectref) {
                if (key === refname) {
                    return this.#raw.selectref[refname];
                }
            }
        }
        else {
            for (const key in this.#parentScopeSelectRef) {
                if (key === refname) {
                    return this.#parentScopeSelectRef[refname];
                }
            }
        }
        
        throw new PromptMetadataError(`Invalid selectref: ${refname}`, this.#raw);
    }

    #getDefaultValue(varMetadta:VarMetadata):any {
        switch (varMetadta.type) {
            case PROMPT_VAR_TYPE.SELECT:
                return varMetadta.options?.[0]?.value ?? '';
            case PROMPT_VAR_TYPE.TEXT:
            case PROMPT_VAR_TYPE.TEXT_MULTILINE:
                return '';
            case PROMPT_VAR_TYPE.ARRAY:
                return [];
            case PROMPT_VAR_TYPE.IMAGE:
                return null;
            case PROMPT_VAR_TYPE.BOOLEAN:
                return false;
            case PROMPT_VAR_TYPE.NUMBER:
                return 0;
            case PROMPT_VAR_TYPE.TUPLE:
                return [];
        }
    }

    async loadPromptTemplate() {
        if (this.#promptTemplate != null) return;

        try {
            const template = await LocalInteractive.loadPromptTemplate(this.#path, this.#basePath);
            this.#promptTemplate = template;
        }
        catch (e:any) {
            throw new PromptTemplateLoadError(e.message ?? '');
        }
    }

    get name() {
        return this.#name;
    }
    get display_name() {    
        return this.#display_name;
    }
    get key() {
        return this.#key;
    }
    get vars() {
        return this.#varMetadata;
    }
    get showInHeaderVars() {
        return this.#showInHeaderVarMetadata;
    }
    get path() {
        return this.#path;
    }
    get raw() {
        return this.#raw;
    }
    setVar(varname:string, value:any) {
        this.#vars[varname] = value;
    }
    getVar(varname:string) {
        return this.#vars[varname];
    }
    /**
     * @param index1 - 상위 리스트에 정의된 인덱스 1
     * @param index2 - 상위 리스트에 정의된 인덱스 2
     */
    setIndexes(index1:number, index2:number) {
        this.#externalIndex = [index1, index2];
    }
    get indexes() {
        return [...this.#externalIndex];
    }
    get promptTemplate() {
        return this.#promptTemplate;
    }
}

