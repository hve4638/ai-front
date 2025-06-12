import WorkNode from './WorkNode';
import { ChatAI, ChatAIError } from '@hve/chatai';
import type { ChatAIResult, ChatMessage, KnownProvider } from '@hve/chatai';
import ChatAIModels from '@/features/chatai-models';
import { WorkNodeStop } from './errors';
import { ProfileAPIKeyControl } from '@/features/profile-control';

type ChatAIFetchNodeInput = {
    messages: ChatMessage[];
}
type ChatAIFetchNodeOutput = {
    result: ChatAIResult;
}
type ChatAIFetchNodeOption = {
    // specificModelId?:string;
}

class ChatAIFetchNode extends WorkNode<ChatAIFetchNodeInput, ChatAIFetchNodeOutput, ChatAIFetchNodeOption> {
    async process(
        { messages }: ChatAIFetchNodeInput,
    ): Promise<ChatAIFetchNodeOutput> {
        const {
            modelId, sender, profile, rtId, 
        } = this.nodeData;

        const modelData = ChatAIModels.getModel(modelId);
        if (!modelData) {
            sender.sendError(
                `Unknown model: ${modelId}`,
                []
            );
            throw new WorkNodeStop();
        }
        const { name: modelName, providerName, flags } = modelData;
        const provider: KnownProvider | 'custom' | 'nothing' = (
            flags.vertexai_endpoint ? 'vertexai'
            : flags.chat_completions_endpoint ? 'openai'
            : flags.claude_endpoint ? 'anthropic'
            : flags.generative_language_endpoint ? 'google'
            : flags.custom_endpoint ? 'custom'
            : 'nothing'
        );

        if (provider == 'nothing') {
            sender.sendError(
                `Fetch Fail : Model '${modelName}' has no provider configured.`,
                []
            );
            throw new WorkNodeStop();
        }
        else if (provider == 'custom') {
            await new Promise(resolve => setTimeout(resolve, 1000));

            let content: string = '';
            switch (modelId) {
                case 'debug:mirror':
                    content = messages.flatMap(
                        m => m.content.flatMap(
                            c => {
                                if (c.chatType === 'TEXT') {
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
                        `Fetch Fail : Model '${modelName}' has no provider configured.`,
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
                    },
                }
            }
        }
        else {
            const profileAPIKeyControl = new ProfileAPIKeyControl(profile);
            const apiKey = await profileAPIKeyControl.nextAPIKey(provider);
            const rt = profile.rt(rtId);
            // @TODO : 'default'로 임시 하드코딩
            // flow모드 구현 시 수정 필요
            const { model } = await rt.getPromptMetadata('default');

            if (!apiKey) {
                sender.sendError(
                    `No API key found for provider '${provider}'`,
                    []
                );
                throw new WorkNodeStop();
            }
            const secret = provider === 'vertexai'
                ? apiKey
                : { api_key: apiKey };
            // const a = 

            const chatAI = new ChatAI();
            try {
                const result = await chatAI.request({
                    model_name: modelName,
                    provider: provider,
                    message: messages,
                    secret: secret,

                    max_tokens: model?.max_tokens,
                    temperature: model?.temperature,
                    top_p: model?.top_p,
                });

                return {
                    result: result,
                };
            }
            catch (e) {
                if (e instanceof ChatAIError) {
                    sender.sendError(
                        `Fetch Failed`,
                        [e.message]
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
    }
}

export default ChatAIFetchNode;