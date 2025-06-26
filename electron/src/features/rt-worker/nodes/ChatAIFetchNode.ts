import WorkNode from './WorkNode';
import { ChatAI, ChatAIError } from '@hve/chatai';
import type { ChatAIResult, ChatMessages } from '@hve/chatai';
import ChatAIModels from '@/features/chatai-models';
import { WorkNodeStop } from './errors';
import { ProfileAPIKeyControl } from '@/features/profile-control';
import runtime from '@/runtime';

type ChatAIFetchNodeInput = {
    messages: ChatMessages;
}
type ChatAIFetchNodeOutput = {
    result: ChatAIResult;
}
type ChatAIFetchNodeOption = {
    usePromptSetting: true;
    promptId?: string;

    // specificModelId?:string;
} | {
    usePromptSetting: false;

    temperature?: number;
    top_p?: number;
    max_tokens?: number;
}

type ModelOptions = {
    temperature: number;
    top_p: number;
    max_tokens: number;
    use_thinking?: boolean;
    thinking_tokens?: number;
}

class ChatAIFetchNode extends WorkNode<ChatAIFetchNodeInput, ChatAIFetchNodeOutput, ChatAIFetchNodeOption> {
    async process(
        { messages }: ChatAIFetchNodeInput,
    ): Promise<ChatAIFetchNodeOutput> {
        const { sender } = this.nodeData;

        try {
            const result = await this.request(messages);

            if (!result.response.ok) {
                runtime.logger.error(
                    `ChatAI Fetch Error: ${result.response.http_status} - ${result.response.http_status_text}`,
                    result.response.raw
                );
                sender.sendError(
                    `HTTP Error (${result.response.http_status})`,
                    [ JSON.stringify(result.response.raw, null, 2) ]
                );
                throw new WorkNodeStop();
            }


            runtime.logger.debug(
                `ChatAIFetchNode Result:`,
                result.response.raw
            );

            return {
                result: result,
            };
        }
        catch (e) {
            if (e instanceof ChatAIError) {
                sender.sendError(
                    `Failed to fetch`,
                    [e.message]
                );
            }
            else if (e instanceof WorkNodeStop) {
                // nothing to do
            }
            else if (e instanceof Error) {
                runtime.logger.error(
                    `ChatAIFetchNode Error: ${e.message}`,
                    e
                );
                sender.sendError(
                    `Fetch Fail : ${e.message}`,
                    []
                );
            }
            else {
                sender.sendError(
                    e instanceof Error ? e.message : String(e),
                    []
                );
            }
            throw new WorkNodeStop();
        }
    }

    private async request(messages: ChatMessages) {
        const {
            modelId, sender, profile, rtId,
        } = this.nodeData;

        const rt = profile.rt(rtId);
        // @TODO : 'default'로 임시 하드코딩
        // flow모드 구현 시 수정 필요
        const { model } = await rt.getPromptMetadata('default');

        const modelData = ChatAIModels.getModel(modelId);
        if (modelData) {
            return await this.requestDefinedModel(modelData, model, messages);
        }
        else if (modelId.startsWith('custom:')) {
            const dataAC = await profile.accessAsJSON('data.json');
            const customModels: CustomModel[] = dataAC.getOne('custom_models');
            const customModel = customModels.find(m => m.id === modelId);

            if (customModel) {
                return await this.requestCustomModel(customModel, model, messages);
            }
        }

        sender.sendError(
            `Unknown model: ${modelId}`,
            []
        );
        throw new WorkNodeStop();
    }

    private async requestDefinedModel(modelData: ChatAIModel, modelOptions: ModelOptions, messages: ChatMessages) {
        const {
            sender, profile
        } = this.nodeData;

        const { name: modelName, providerName, flags } = modelData;
        const apiName = this.getAPIName(flags);
        if (!apiName) {
            sender.sendError(
                `Fetch Fail : Model '${modelName}' has no provider configured.`,
                []
            );
            throw new WorkNodeStop();
        }

        const profileAPIKeyControl = new ProfileAPIKeyControl(profile);
        const auth = await profileAPIKeyControl.nextAPIKey(apiName);
        const {
            temperature,
            top_p,
            max_tokens,
            use_thinking = false,
            thinking_tokens = 1024,
        } = modelOptions;

        const openAIThinkingEffort = (
            thinking_tokens <= 1024 ? 'low'
                : thinking_tokens <= 8192 ? 'medium'
                    : 'high'
        );
        const useThinking = (
            flags.thinking || (flags.thinking_optional && use_thinking)
        );

        if (!flags.vertexai) {
            const apiKey = auth as string;

            if (flags.responses_api) {
                runtime.logger.trace('Requesting ResponsesAPI (OpenAI)');
                return await ChatAI.requestResponses({
                    model: modelName,
                    messages: messages,
                    auth: {
                        api_key: apiKey as string,
                    },

                    thinking_effort: openAIThinkingEffort,
                    max_tokens,
                    temperature,
                    top_p,
                });
            }
            else if (flags.chat_completions_api) {
                runtime.logger.trace('Requesting ChatCompletionsAPI (OpenAI)');
                return await ChatAI.requestChatCompletion({
                    model: modelName,
                    messages: messages,
                    auth: {
                        api_key: apiKey as string,
                    },

                    max_tokens,
                    temperature,
                    top_p,
                });
            }
            else if (flags.generative_language_api) {
                runtime.logger.trace('Requesting GenerativeLanguageAPI (Google)');
                return await ChatAI.requestGenerativeLanguage({
                    model: modelName,
                    messages: messages,
                    auth: {
                        api_key: apiKey as string,
                    },

                    thinking_tokens: useThinking ? thinking_tokens : undefined,
                    max_tokens,
                    temperature,
                    top_p,
                });
            }
            else if (flags.anthropic_api) {
                runtime.logger.trace('Requesting AnthropicAPI (Anthropic)');
                return await ChatAI.requestAnthropic({
                    model: modelName,
                    messages: messages,
                    auth: {
                        api_key: apiKey as string,
                    },

                    thinking_tokens: useThinking ? thinking_tokens : undefined,
                    max_tokens,
                    temperature,
                    top_p,
                });
            }
        }
        else {
            const vertexAIAuth = auth as VertexAIAuth;
            const location = 'us-east5';

            if (flags.generative_language_api) {
                runtime.logger.trace('Requesting Generative Language API with VertexAI');
                return await ChatAI.requestVertexAI({
                    publisher: 'google',
                    type: 'generative_language',
                    location: 'us-central1',

                    thinking_tokens: useThinking ? thinking_tokens : undefined,
                    model: modelName,
                    messages: messages,
                    auth: vertexAIAuth,

                    max_tokens,
                    temperature,
                    top_p,
                });
            }
            else if (flags.anthropic_api) {
                runtime.logger.trace('Requesting Anthropic API with VertexAI');
                return await ChatAI.requestVertexAI({
                    publisher: 'anthropic',
                    type: 'anthropic',
                    location: 'us-east5',

                    thinking_tokens: useThinking ? thinking_tokens : undefined,
                    model: modelName,
                    messages: messages,
                    auth: vertexAIAuth,

                    max_tokens,
                    temperature,
                    top_p,
                });
            }
        }

        sender.sendError(
            `Fetch Fail : Model '${modelName}' has no provider configured.`,
            []
        );
        throw new WorkNodeStop();
    }

    private async requestCustomModel(customModel: CustomModel, modelOptions: ModelOptions, messages: ChatMessages) {
        const {
            profile,
        } = this.nodeData;

        const profileAPIKeyControl = new ProfileAPIKeyControl(profile);
        const auth = await profileAPIKeyControl.getAuth(customModel.secret_key ?? '');
        const apiKey = auth as string;

        const {
            temperature,
            top_p,
            max_tokens,
            thinking_tokens = 1024,
            use_thinking = false,
        } = modelOptions;

        const openAIThinkingEffort = (
            thinking_tokens <= 1024 ? 'low'
                : thinking_tokens <= 8192 ? 'medium'
                    : 'high'
        );
        const useThinking = (
            customModel.thinking// || (flags.thinking_optional && use_thinking)
        );

        switch (customModel.api_format) {
            case 'chat_completions':
                return await ChatAI.requestChatCompletion({
                    url: customModel.url,

                    model: customModel.model,
                    messages: messages,
                    auth: {
                        api_key: apiKey as string,
                    },

                    max_tokens,
                    temperature,
                    top_p,
                });
                break;
            case 'generative_language':
                return await ChatAI.requestGenerativeLanguage({
                    url: customModel.url,

                    model: customModel.model,
                    messages: messages,
                    auth: {
                        api_key: apiKey as string,
                    },

                    max_tokens,
                    temperature,
                    top_p,
                });
                break;
            case 'anthropic_claude':
                return await ChatAI.requestAnthropic({
                    url: customModel.url,

                    model: customModel.model,
                    messages: messages,
                    auth: {
                        api_key: apiKey as string,
                    },

                    max_tokens,
                    temperature,
                    top_p,
                });
            default:
                const sender = this.nodeData.sender;
                sender.sendError(
                    `Fetch Fail : Custom model '${customModel.name}' has unsupported API format '${customModel.api_format}'.`,
                    []
                );
                throw new WorkNodeStop();
                break;
        }
    }

    private getAPIName(flags: ChatAIModelFlags): 'openai' | 'anthropic' | 'google' | 'vertexai' | null {
        return (
            flags.vertexai ? 'vertexai'
                : flags.chat_completions_api ? 'openai'
                    : flags.responses_api ? 'openai'
                        : flags.anthropic_api ? 'anthropic'
                            : flags.generative_language_api ? 'google'
                                : null
        );
    }

    async getResultDebug({ messages }: { messages: ChatMessages; }) {
        const {
            modelId, sender, profile, rtId,
        } = this.nodeData;
        await new Promise(resolve => setTimeout(resolve, 1000));

        let content: string = '';
        switch (modelId) {
            case 'debug:mirror':
                content = messages.flatMap(
                    m => m.content.flatMap(
                        c => {
                            if (c.chatType === 'Text') {
                                return [c.text ?? ''];
                            }
                            else {
                                return [];
                            }
                        }
                    )
                ).join('\n');
                break;
            default:
                sender.sendError(
                    `Fetch Fail : Model '${modelId}' has no provider configured.`,
                    []
                );
                throw new WorkNodeStop();
                break;
        }

        return {
            result: {
                request: {} as any,
                response: {
                    ok: true,
                    http_status: 200,
                    http_status_text: 'OK',
                    raw: {},
                    content: [content],
                    warning: null,
                    tokens: {
                        input: 10,
                        output: 20,
                        total: 30,
                    },
                    finish_reason: 'stop',
                } as any,
            }
        }
    }
}

export default ChatAIFetchNode;