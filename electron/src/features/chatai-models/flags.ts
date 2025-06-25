const flags:Required<ChatAIModelFlags> = {
    featured: true,
    stable: true,
    latest: true,
    experimental: true,
    deprecated: true,
    legacy: true,
    snapshot: true,
    high_cost: true,
    
    thinking: true,
    thinking_optional: true,
    cache: true,

    stream: true,
    function_call: true,
    structured_output: true,
    
    google_gemini_cache_v1: true,
    claude_cache_v1: true,
    openai_cache_v1: true,

    chat_completions_api: true,
    responses_api: true,
    generative_language_api: true,
    anthropic_api: true,
    vertexai: true,

    custom_endpoint: true,
}

export default flags;