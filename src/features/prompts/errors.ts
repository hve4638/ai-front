/**
 * PromptListParser 외부로 노출되는 에러
 * PromptListParser는 기본 JS 에러와 이 에러만 노출함
 */
export class PromptMetadataTreeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PromptMetadataTreeError';
    }
}

/**
 * 
 */
export class PromptTemplateLoadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PromptTemplateLoadError';
    }
}

/**
 * PromptListParser 내에서만 사용됨
 * 해당 에러는 내부적으로 처리되거나 PromptMetadataErrorWrapper로 변환되어 노출됨
 */
export class PromptMetadataError extends Error {
    rawdata: any;

    constructor(message: string, rawdata: any) {
        super(message);
        this.name = 'PromptMetadataError';
        this.rawdata = rawdata;
    }
}

export class StructVerifyFailedError extends PromptMetadataError {
    constructor(message: string, rawdata: any) {
        super(message, rawdata);
        this.name = 'VerifyFailedError';
    }
}