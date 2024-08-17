import { DEBUG_MODE, TARGET_ENV } from "data/constants"

export const MODELS = {
    GOOGLE_GEMINI : "GOOGLE_GEMINI",
    OPENAI_GPT : "OPENAI_GPT",
    CLAUDE : "CLAUDE",
    GOOGLE_VERTEXAI : "GOOGLE_VERTEXAI",
    DEBUG_MODE : "DEBUG"
} as const;

export const MODEL_CATEGORY = {
    [MODELS.GOOGLE_GEMINI] : {
        name : "Google Gemini",
        models : [
            { name : "Gemini 1.5 Pro ", value: "gemini-1.5-pro-latest" },
            { name : "Gemini 1.5 Flash", value: "gemini-1.5-flash" },
            { name : "Gemini 1.0 Pro", value: "gemini-1.0-pro" },
        ]
    },
    [MODELS.OPENAI_GPT] : {
        name: "OpenAI GPT",
        models : [
            { name : "GPT-4o", value: "gpt-4o" },
            { name : "GPT-4o mini", value: "gpt-4o-mini" },
            { name : "GPT-4 Turbo", value: "gpt-4-turbo" },
        ]
    },
}

if (TARGET_ENV === "WINDOWS") {
    // CORS 정책으로 WEB에서 사용할 수 없는 모델 목록

    MODEL_CATEGORY[MODELS.CLAUDE] = {
        "name" : "Anthropic Claude",
        "models" : [
            { name : "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20240620" },
            { name : "Claude 3 Opus", value: "claude-3-opus-20240229" },
            { name : "Claude 3 Haiku", value: "claude-3-haiku-20240307" },
        ]
    };
    MODEL_CATEGORY[MODELS.GOOGLE_VERTEXAI] = {
        name : "Google VertexAI",
        models : [
            { name : "Claude 3.5 Sonnet", value: "claude-3-5-sonnet@20240620" },
            { name : "Claude 3 Opus", value: "claude-3-opus@20240229" },
            { name : "Claude 3 Haiku", value: "claude-3-haiku@20240307" },
        ]
    }
}

if (DEBUG_MODE) {
    MODEL_CATEGORY[MODELS.DEBUG_MODE] = {
        "name" : "Debug Mode",
        "models" : [
            { name : "DEBUG : ECHO", value: "debug-mode" }
        ]
    };
}