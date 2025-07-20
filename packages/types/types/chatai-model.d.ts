declare global {
    /**
     * 각 모델의 특징을 나타내는 플래그
     */
    type ChatAIModelFlags = {
        // 단순 구분 및 시각화를 위한 플래그
        featured? : true;
        stable? : true;
        latest? : true;
        experimental? : true;
        deprecated? : true;
        legacy? : true;
        snapshot? : true;
        high_cost? : true;

        // 기능 구분 플래그
        thinking? : true; // 추론 모델
        thinking_optional? : true; // 선택적 추론 모델
        cache? : true; // 캐싱 지원

        // 출력 형식 지정
        stream? : true;
        function_call?: true;
        structured_output?: true;

        // 각 모델의 캐시 방식에 따른 구분
        google_gemini_cache_v1? : true;
        claude_cache_v1? : true;
        openai_cache_v1? : true;

        // 엔드포인트. 최소 하나의 엔드포인트 플래그가 있어야 함
        chat_completions_api? : true;
        responses_api? : true;
        generative_language_api? : true;
        anthropic_api? : true;
        vertexai? : true;

        // 디버그 전용
        custom_endpoint? : true;
    }
    type ChatAIModel = {
        id: string;
        name: string;
        displayName: string;
        providerName: string;
        providerDisplayName: string;
        flags : ChatAIModelFlags;
    }
    type ChatAIMoedelCategory = {
        name : string;
        list : ChatAIModel[];
    };
    type ChatAIModelProviders = {
        name : string;
        list : ChatAIMoedelCategory[];
    };
    type ChatAIModels = ChatAIModelProviders[];
}

export {};