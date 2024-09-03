export const PROMPT_METADATA_PARSE_ERRORS = {
    INVALID_FORMAT : 'INVALID_FORMAT', // 값 유효성 검증 실패
    NO_PROMPTS : 'NO_PROMPTS', // prompts 필드가 없을 때
    NO_FIELD : 'NO_FIELD', // 필드가 없을 때
    MODULE_NOT_FOUND : 'MODULE_NOT_FOUND',
    INVALID_MODULE_NAME : 'INVALID_MODULE_NAME',
    INVALID_MODULE : 'INVALID_MODULE',
    OTHER : 'OTHER'
} as const;
export type PROMPT_METADATA_PARSE_ERRORS = typeof PROMPT_METADATA_PARSE_ERRORS[keyof typeof PROMPT_METADATA_PARSE_ERRORS];

type PromptMetadataParseErrorArgs = {
    errorType: PROMPT_METADATA_PARSE_ERRORS;
    target?:any;
}

/**
 * 프롬프트 메타데이터 파싱 중 외부로 노출되는 에러
 */
export class PromptMetadataParseError extends Error {
    extraInfomation:PromptMetadataParseErrorArgs;

    constructor(
        message: string,
        extraInfomation?:PromptMetadataParseErrorArgs
    ) {
        super(message);
        this.name = 'PromptMetadataParseError';
        this.extraInfomation = extraInfomation ?? {
            errorType : PROMPT_METADATA_PARSE_ERRORS.OTHER,
        };
    }
}

/**
 * PromptMetadata에서 템플릿을 가져오지 못한 경우
 */
export class PromptTemplateLoadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PromptTemplateLoadError';
    }
}

/**
 * PromptMetadataTree 내에서만 사용됨
 * 해당 에러는 내부적으로 처리되거나 PromptMetadataErrorWrapper로 변환되어 노출됨
 */
export class PromptMetadataInternalError extends Error {
    rawdata: any;

    constructor(message: string, rawdata: any) {
        super(message);
        this.name = 'PromptMetadataInternalError';
        this.rawdata = rawdata;
    }
}

export class StructVerifyFailedError extends PromptMetadataInternalError {
    constructor(message: string, rawdata: any) {
        super(message, rawdata);
        this.name = 'VerifyFailedError';
    }
}

export class VarMetadataError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'VarMetadataError';
    }
}