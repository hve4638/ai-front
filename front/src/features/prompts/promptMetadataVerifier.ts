import { PROMPT_VAR_TYPE } from "./data";
import {
    PromptMetadataParseError,
    PROMPT_METADATA_PARSE_ERRORS as ErrorType,
} from "./errors";
import {
    RawPromptMetadata,
    RawPromptMetadataElement,
    RawPromptMetadataList,

    LegacyPromptMetadataTree,
    LegacyArrayElementMetadata,
    LegacyPromptMetadata,
    LegacyPromptMetadataElement,
    LegacyPromptMetadataList,
    LegacyImportPromptMetadata,
    LegacyVarMetadata,

    Selects,
    RawPromptMetadataTree,
    RawImportPromptMetadata,
    RawVarMetadata,
    RawArrayElementMetadata
} from "./types";

type Hint = {
    name : string;
}

export class PromptMetadataVerifier {
    modules: string[] = [];

    /**
     * 원시 포맷의 적합성 검증 및 임포트 모듈 이름 추출
     * 
     * Legacy 필드를 현 포맷에 맞게 변환 수행, 필수 필드 유무 및 Legacy 포맷 변환만 수행하고 값의 유효성은 검증하지 않음
     * 
     * @returns RootPromptMetadata와 필요한 Metadata 모듈 이름을 튜플 형태로 반환
     */
    parsePromptMetadataTree(promptMetadataTreeText:string, hint:Hint):[RawPromptMetadataTree, string[]] {
        this.modules = [];
        
        let rawRoot:LegacyPromptMetadataTree;
        try {
            rawRoot = JSON.parse(promptMetadataTreeText);
        }
        catch(e:any) {
            throw this.#errorInvalidJson(hint.name, e);
        }
        const tree = this.#parsePromptMetadataTree(rawRoot);

        return [tree, this.modules];
    }

    parseModulePromptMetadata(modulePromptMetadataText:string, hint:Hint):RawPromptMetadataElement {
        this.modules = [];
        // #parsePromptMetadata
        let rawModuleContent:LegacyPromptMetadata;
        try {
            rawModuleContent = JSON.parse(modulePromptMetadataText);
        }
        catch(e:any) {
            throw this.#errorInvalidJson(hint.name, e);
        }
        const metadata = this.#parsePromptMetadata(rawModuleContent);

        if ('import' in metadata) {
            throw new PromptMetadataParseError(
                'Nested PromptImportMetadata는 지원되지 않습니다',
                {
                    errorType: ErrorType.INVALID_MODULE,
                    target: JSON.stringify(modulePromptMetadataText, null, 2),
                }
            );
        }

        return metadata;
    }

    #parsePromptMetadataTree(root:LegacyPromptMetadataTree):RawPromptMetadataTree {
        return {
            prompts: this.#parsePrompts(root),
            selects: this.#parseSelects(root),
        } as RawPromptMetadataTree;
    }

    #parsePrompts(rawTree:LegacyPromptMetadataTree):RawPromptMetadataElement[] {
        if (!rawTree.prompts) {
            throw new PromptMetadataParseError(
                "최상위 블럭에 'prompts' 필드가 없습니다",
                {
                    errorType: ErrorType.NO_PROMPTS,
                }
            )
        }

        const prompts:RawPromptMetadataElement[] = [];
        for (const rawMetadata of rawTree.prompts) {
            const metadata = this.#parsePromptMetadata(rawMetadata);
            prompts.push(metadata);
        }

        return prompts;
    }

    #parsePromptMetadata(element:LegacyPromptMetadataElement):RawPromptMetadataElement {
        // element가 PromptImportMetadata 인 경우
        if ("import" in element) {
            this.modules.push(element.import);

            return {
                import: element.import,
            };
        }

        this.#checkField(element, "key");
        this.#checkField(element, "name");
        
        // Metadata를 RawPromptMetadataList로 예상
        if ("list" in element) {
            const result:RawPromptMetadataList = {
                key: element.key,
                name: element.name,
                display_name: element.display_name,
                list: [],
            };

            for (const rawSubMetadata of element.list) {
                const subMetadata = this.#parsePromptMetadata(rawSubMetadata);

                result.list.push(subMetadata);
            }

            return result;
        }
        // Metadata를 RawPromptMetadata로 예상
        else {
            const pathField = element.path ?? element.value;
            if (pathField == null) {
                throw this.#errorNoField("path", element);
            }

            const result:RawPromptMetadata = {
                key: element.key,
                name: element.name,
                path : pathField,
                vars: this.#parseVarMetadatas(element.vars),
                selects: element.selects ?? element.selectref,
            };

            return result; 
        }
    }

    #parseVarMetadatas(metadatas?:(LegacyVarMetadata|string)[]):RawVarMetadata[]|undefined {
        const result:RawVarMetadata[] = [];

        if (metadatas == null) {
            return undefined;
        }
        
        for (const data of metadatas) {
            let metadata:RawVarMetadata;
            if (typeof data === "string") {
                metadata = {
                    type: PROMPT_VAR_TYPE.SELECT,
                    name: data,
                    show_in_header: true,
                    select_ref: data,
                };
            }
            else {
                metadata = this.#parseVarMetadata(data);
            }
            result.push(metadata);
        }
        return result;
    }

    #parseVarMetadata(metadata:LegacyVarMetadata):RawVarMetadata {
        this.#checkField(metadata, "type");
        this.#checkField(metadata, "name");
        
        const result:RawVarMetadata = {
            type : metadata.type,
            name : metadata.name,
            display_name : metadata.display_name,
            default_value : metadata.default_value,
            show_in_header : metadata.show_in_header,
            options : metadata.options,
            element : this.#parseArrayElementMetadata(metadata.element),
            fields : this.#parseVarMetadatas(metadata.fields),
            select_ref : metadata.select_ref ?? metadata.selectref,
        };
        return result;
    }

    #parseArrayElementMetadata(metadata?:LegacyArrayElementMetadata):RawArrayElementMetadata|undefined {
        if (metadata == null) {
            return undefined;
        }
        this.#checkField(metadata, "type");
        
        return {
            type : metadata.type,
            default_value : metadata.default_value,
            select_ref : metadata.select_ref,
            options : metadata.options,
            element : metadata.element,
            fields : metadata.fields,
        }
    }

    #parseSelects(rawTree:LegacyPromptMetadataTree):Selects {
        const selects = rawTree.selects ?? rawTree.selectref ?? rawTree.vars;
        if (!selects) {
            return {};
        }
        return selects;
    }

    #checkField(element:any, field:string) {
        if (!(field in element)) {
            throw this.#errorNoField(field, element);
        }
    }

    #errorNoField(field:string, target:any) {
        return new PromptMetadataParseError(
            `'${field}' 필드가 없습니다`,
            {
                errorType: ErrorType.NO_FIELD,
                target: JSON.stringify(target, null, 2),
            }
        );
    }

    #errorInvalidJson(filename, error:Error) {
        return new PromptMetadataParseError(
            `올바른 JSON 형식이 아닙니다 (${filename})`,
            {
                errorType: ErrorType.INVALID_FORMAT,
                target : error.message
            }
        )
    }
}