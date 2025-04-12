import { PromptTemplate, CBFFail,  type CBFResult } from '@hve/prompt-template';
import { Chat, ChatRole, ChatType } from '@hve/chatai';
import { GlobalRTFlowData, WorkLog } from '../types';
import { BUILT_IN_VARS, HOOKS } from '../data';
import WorkNode, { NodeData } from './WorkNode';
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
        } = this.nodeData.flowData;
        const {
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
        if (input_type === 'CHAT') {
            additionalBuiltInVars['chat'] = chat;
        }
        else if (input_type === 'NORMAL') {
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