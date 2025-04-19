import { PromptTemplate } from '@hve/prompt-template';
import { Chat, ChatRole } from '@hve/chatai';
import { BUILT_IN_VARS, HOOKS } from '../data';
import WorkNode from './WorkNode';
import type { NodeData } from './types';
import { PromptMessages } from './node-types';
import { WorkNodeStop } from './errors';

export type PromptBuildNodeInput = {
    input?:string;
    chat?:RTInputMessage[];
}
export type PromptBuildNodeOutput = {
    promptMessage:PromptMessages;
}
export type PromptBuildNodeOption = {
    promptId:string;
    form : {
        [key:string]: { link:true, src:string, value?:unknown } | { link?:false, value:unknown };
    };
}

class PromptBuildNode extends WorkNode<PromptBuildNodeInput, PromptBuildNodeOutput, PromptBuildNodeOption>  {
    override async process(
        {
            input,
            chat,
        }:PromptBuildNodeInput,
    ) {
        const {
            profile, rtId,
            logger,
        } = this.nodeData;
        const {
            input_type,
            forms : requiredForms,
            contents,
        } = await profile.getRTPromptData(rtId, this.option.promptId, ['input_type', 'forms', 'contents']);

        const { nodes, errors } = PromptTemplate.build(contents);
        if (errors.length > 0) {
            logger.nodeError(this.nodeId, errors.map(e=>e.message));
            throw new WorkNodeStop();
        }
    
        const additionalBuiltInVars = {};
        if (input_type === 'chat') {
            if (chat == null) {
                logger.nodeError(this.nodeId, [ 'chat is null' ]);
                throw new WorkNodeStop();
            }
            additionalBuiltInVars['chat'] = chat;
        }
        else if (input_type === 'normal') {
            if (input == null) {
                logger.nodeError(this.nodeId, [ 'input is null' ]);
                throw new WorkNodeStop();
            }
            additionalBuiltInVars['input'] = input;
        }
    
        const generator = PromptTemplate.execute(nodes, {
            builtInVars : {
                ...BUILT_IN_VARS,
                ...additionalBuiltInVars,
            },
            vars : {},
            hook : HOOKS,
        });

        const promptMessage:PromptMessages = [];
        for (const result of generator) {
            switch(result.type) {
                case 'ROLE':
                    switch(result.role.toLowerCase()) {
                        case 'user':
                            promptMessage.push(ChatRole.User());
                            break;
                        case 'assistant':
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
                    throw new Error();
                    break;
                case 'SPLIT':
                    break;
            }
        }
        return { promptMessage };
    }
}

export default PromptBuildNode;