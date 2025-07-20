declare global {
    type ModelConfiguration = {
        /**
         * 전역 설정에서 기존 설정을 덮어쓰는지 여부
         * 
         * 전역 설정이 아니라면 무시됨
         */
        override_config?: boolean;

        stream?: boolean;
        top_p?: number;
        temperature?: number;
        max_tokens?: number;
        use_thinking?: boolean;
        thinking_auto_budget?: boolean;
        thinking_tokens?: number;
        thinking_summary?: boolean;
        safety_settings?: {
            HARM_CATEGORY_HARASSMENT?: GeminiSafetyThreshold,
            HARM_CATEGORY_HATE_SPEECH?: GeminiSafetyThreshold,
            HARM_CATEGORY_SEXUALLY_EXPLICIT?: GeminiSafetyThreshold,
            HARM_CATEGORY_DANGEROUS_CONTENT?: GeminiSafetyThreshold,
            HARM_CATEGORY_CIVIC_INTEGRITY?: GeminiSafetyThreshold,
        }
    }

    type GeminiSafetyThreshold = (
        'OFF'
        | 'BLOCK_NONE'
        | 'BLOCK_ONLY_HIGH'
        | 'BLOCK_MEDIUM_AND_ABOVE'
        | 'BLOCK_LOW_AND_ABOVE'
    );
}

export {};
