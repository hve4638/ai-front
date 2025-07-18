import { CBFFail, CBFResult, PromptGenerator, PromptTemplate } from '@hve/prompt-template';
import { Chat, ChatMessages, ChatRole } from '@hve/chatai';
import { BUILT_IN_VARS, HOOKS } from '../data';
import WorkNode from './WorkNode';
import { WorkNodeStop } from './errors';
import ChatGenerator from '../prompt-generator/ChatGenerator';
import { InputPromptGenerator } from '../prompt-generator';
import { UserInput } from './types';

export type PromptBuildNodeInput = {
    input: UserInput;
}
export type PromptBuildNodeOutput = {
    messages: ChatMessages;
}
export type PromptBuildNodeOption = {
    promptId: string;
    form: {
        [key: string]: { link: true, src: string, value?: unknown } | { link?: false, value: unknown };
    };
}

function getDefaultValue(promptVar: PromptVar): unknown {
    switch (promptVar.type) {
        case 'checkbox':
        case 'text':
        case 'number':
            return promptVar.default_value;
        case 'select':
            return (
                promptVar.options.length == 0
                    ? ''
                    : promptVar.options[0].value
            );
        case 'array':
            return [];
        case 'struct':
            return {};
    }
}

class PromptBuildNode extends WorkNode<PromptBuildNodeInput, PromptBuildNodeOutput, PromptBuildNodeOption> {
    override name = 'PromptBuildNode';

    override async process(
        {
            input,
        }: PromptBuildNodeInput,
    ) {
        const {
            profile, rtId, logger, rtEventEmitter, chat
        } = this.nodeData;
        const rt = profile.rt(rtId);
        const promptVars = await rt.getPromptVariables(this.option.promptId);
        const contents = await rt.getPromptContents(this.option.promptId);

        const { form } = this.nodeData;
        const vars = {};
        promptVars.forEach((v) => {
            vars[v.name] = form[v.id!] ?? getDefaultValue(v);
        });

        const { nodes, errors } = PromptTemplate.build(contents);
        if (errors.length > 0) {
            this.logger.error(`Prompt build failed (id=${this.nodeId})`);

            rtEventEmitter.emit.error.promptBuildFailed(
                errors.map((e: CBFFail) => {
                    this.logger.debug(`Prompt build failed ${e.message}`);
                    return `${e.message} (${e.positionBegin})`;
                })
            );
            throw new WorkNodeStop();
        }

        const additionalBuiltInVars = {};
        additionalBuiltInVars['input'] = new InputPromptGenerator({ text: input.text, files: input.files });
        additionalBuiltInVars['chat'] = new ChatGenerator(chat);

        let generator: Generator<CBFResult>;
        try {
            generator = PromptTemplate.execute(nodes, {
                builtInVars: {
                    ...BUILT_IN_VARS,
                    ...additionalBuiltInVars,
                },
                vars: vars,
                hook: HOOKS,
            });
        }
        catch (e) {

            throw new WorkNodeStop();
        }

        const promptMessage: ChatMessages = [];
        const processResult = (result: CBFResult) => {
            switch (result.type) {
                case 'ROLE':
                    switch (result.role.toLowerCase()) {
                        case 'user':
                            promptMessage.push(ChatRole.User());
                            break;
                        case 'assistant':
                        case 'model':
                        case 'bot':
                            promptMessage.push(ChatRole.Assistant());
                            break;
                        case 'system':
                            promptMessage.push(ChatRole.System());
                            break;
                    }
                    break;
                case 'TEXT':
                    if (promptMessage.length === 0) {
                        promptMessage.push(ChatRole.User());
                    }
                    promptMessage.at(-1)?.content.push(Chat.Text(result.text));
                    break;
                case 'IMAGE':
                    if (promptMessage.length === 0) {
                        promptMessage.push(ChatRole.User());
                    }
                    promptMessage.at(-1)?.content.push(Chat.Image.Base64(result.data));
                    break;
                case 'FILE':
                    if (promptMessage.length === 0) {
                        promptMessage.push(ChatRole.User());
                    }
                    promptMessage.at(-1)?.content.push(Chat.PDF.Base64(result.filename, result.data));
                    break;
                case 'SPLIT':
                    break;
            }
        }

        try {
            for (const result of generator) {
                processResult(result);
            }
        }
        catch (e) {
            this.logger.warn(e);

            rtEventEmitter.emit.error.promptEvaluateFailed(
                [(e as any).message]
            );
            throw new WorkNodeStop();
        }
        return { messages: promptMessage };
    }
}

export default PromptBuildNode;