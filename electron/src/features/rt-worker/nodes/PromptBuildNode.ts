import PromptTemplate, { CBFResult } from '@hve/prompt-template';
import { Chat, ChatRole } from '@hve/chatai';
import { GlobalNodeOption, WorkLog } from '../types';
import { BUILT_IN_VARS, HOOKS } from '../data';
import WorkNode from './Node';

export type PromptBuildNodeInput = {
    message:RTInputMessage[];
    form:Record<string, any>;
}
export type PromptBuildNodeOutput = {
    prompt:Generator<CBFResult>;
}
export type PromptBuildNodeOption = {
    promptId:string;
}

class PromptBuildNode extends WorkNode<PromptBuildNodeInput, PromptBuildNodeOutput, PromptBuildNodeOption>  {
    async process(
        input:PromptBuildNodeInput,
        nodeOption:PromptBuildNodeOption,
        globalOption:GlobalNodeOption,
        workLog:WorkLog[]
    ) {
        const {
            profile, rtId
        } = globalOption;
        const {
            promptId
        } = nodeOption;
        const {
            input_type,
            forms : requiredForms,
            contents,
        } = await profile.getRTPromptData(rtId, 'default', ['input_type', 'forms', 'contents']);
    
        const { nodes, errors } = PromptTemplate.build(contents);
        if (errors.length > 0) {
            workLog.push({ type : 'node_error', nodeId : 0, message : errors.map(e=>e.message) });
        }
    
        const additionalBuiltInVars = {};
        if (input_type === 'chat') {
            additionalBuiltInVars['chat'] = input.message;
        }
        else if (input_type === 'normal') {
            additionalBuiltInVars['input'] = input.message.at(-1)?.message ?? '';
        }
    
        const generator = PromptTemplate.execute(nodes, {
            builtInVars : {
                ...BUILT_IN_VARS,
                ...additionalBuiltInVars,
            },
            vars : input.form,
            hook : HOOKS,
        });

        const message:{ role:string, content:any[] }[] = [];
        for (const result of generator) {
            switch(result.type) {
                case 'ROLE':
                    switch(result.role.toLowerCase()) {
                        case 'user':
                            message.push(ChatRole.User());
                            break;
                        case 'assistant':
                        case 'bot': // alias
                            message.push(ChatRole.Assistant());
                            break;
                        case 'system':
                            message.push(ChatRole.System());
                            break;
                    }
                    break;
                case 'TEXT':
                    if (message.length === 0) {
                        message.push(ChatRole.User());
                    }
                    message.at(-1)?.content.push(result.text);
                    break;
                case 'IMAGE':
                    throw new Error();
                    break;
                case 'SPLIT':
                    break;
            }
        }
        return {
            prompt : generator,
        };
    }
}

export default PromptBuildNode;