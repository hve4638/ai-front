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
    cache: true,

    stream: true,
    function_call: true,
    structured_output: true,
    
    google_gemini_cache_v1: true,
    claude_cache_v1: true,
    openai_cache_v1: true,

    chat_completions_endpoint: true,
    generative_language_endpoint: true,
    claude_endpoint: true,
    vertexai_endpoint: true,
    custom_endpoint: true
    
    // openai_reasoning: true,
}

export default flags;