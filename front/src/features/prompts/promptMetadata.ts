import { PromptTemplateLoadError, StructVerifyFailedError } from './errors';
import type {
    IPromptMetadata,
    RawPromptMetadata,
    Selects,
    VarMetadata
} from './types'
import { CopiedPromptMetadata } from './copiedPromptMetadata';
import { VarMetadataParser } from './varMetadataParser';

type PromptMetadataArgs = {
    basePath:string;
    selects:Selects;
}
export class PromptMetadata implements IPromptMetadata {
    static #onLoadPromptTemplate?:(metadata:PromptMetadata)=>Promise<string>;
    #profile:string = '';
    #raw:RawPromptMetadata = {} as any;
    #promptTemplate?:string = undefined;
    #name:string = '';
    #display_name:string = '';
    #key:string = '';
    #path:string = '';
    #basePath:string = '';
    #varMetadata:VarMetadata[] = [];
    #showInHeaderVarMetadata:VarMetadata[] = [];
    #vars:{[key:string]:any} = {};
    #externalIndex:[number, number|null] = [-1, null];

    static setOnLoadPromptTemplate(callback:(metadata:PromptMetadata)=>Promise<string>) {
        this.#onLoadPromptTemplate = callback;
    }

    static parse(profile:string, raw: RawPromptMetadata, { basePath, selects }: PromptMetadataArgs):PromptMetadata {
        const metadata = new PromptMetadata();
        metadata.#profile = profile;
        metadata.#parse(raw, { basePath, selects });
        return metadata;
    }

    #parse(raw: RawPromptMetadata, { basePath, selects }: PromptMetadataArgs) {
        this.#verify(raw);
        
        this.#raw = raw;
        this.#basePath = basePath;

        this.#name = raw.name;
        this.#display_name = raw.name;
        this.#key = raw.key;
        this.#path = raw.path;

        if (raw.vars != null) {
            const localSelectRef = raw.selects;
            const currentScopeSelects = {
                ...selects,
                ...localSelectRef
            }
            const varMetadataParser = new VarMetadataParser(currentScopeSelects);
            for (const data of raw.vars) {
                let varMetadata:VarMetadata;
                varMetadata = varMetadataParser.parse(data);
                
                if (varMetadata.type === 'select' && varMetadata.show_in_header) {
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

        if (!data.key) throw missing('key');
        if (!data.name) throw missing('name');
        if (!data.path) throw missing('path');
    }
    
    async loadPromptTemplate({onFail}) {
        if (this.#promptTemplate != null) return;

        try {
            const loadTemplate = PromptMetadata.#onLoadPromptTemplate;
            if (!loadTemplate) {
                onFail(new PromptTemplateLoadError("onLoadPromptTemplate 'callback' is not set"));
                return;
            }
            
            const template = await loadTemplate(this);
            // @TODO: 레거시 코드
            if (template.startsWith("@FAIL")) {
                onFail(
                    new PromptTemplateLoadError(
                        `Fail to load prompt template : ${this.#path}\n\n${template}`
                    )
                );
            }
            else {
                this.#promptTemplate = template;
            }
        }
        catch (e:any) {
            onFail(e);
        }
    }

    get profile() {
        return this.#profile;
    }
    /**
     * 모듈일 경우 모듈의 경로, 아닐 경우 빈 문자열
     */
    get basePath() {
        return this.#basePath;
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
    setVarValue(varname:string, value:any) {
        this.#vars[varname] = value;
    }
    getVarValue(varname:string) {
        return this.#vars[varname];
    }
    setVarValues(vars:{[key:string]:any}) {
        for (const key in vars) {
            this.#vars[key] = vars[key];
        }
    }
    getVarValues() {
        return { ...this.#vars };
    }
    
    setIndexes(index1:number, index2:number|null) {
        this.#externalIndex = [index1, index2];
    }
    get indexes() {
        return [...this.#externalIndex] as [number, number|null];
    }
    get promptTemplate() {
        if (this.#promptTemplate == null) {
            return "";
            throw new PromptTemplateLoadError('Prompt template is not loaded');
        }
        return this.#promptTemplate;
    }
    getAllVarValue(): { [key: string]: any; } {
        return { ...this.#vars };
    }
    
    commitCurrentVarValue():void {
        // CopiedPromptMetadata 에서 호출시 var 값을 원본으로 복사
        // 원본이 호출시 아무것도 하지않음
    }

    copy() {
        return new CopiedPromptMetadata(this);
    }
}

