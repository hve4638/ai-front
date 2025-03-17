import ChatAI from '@hve/chatai';
import PromptTemplate, { CBFResult } from '@hve/prompt-template';
import { type Profile } from '@features/profiles';

import { GlobalNodeOption, WorkLog, type ChatRequestForm } from './types';
import { BUILT_IN_VARS } from './data';
import { PromptBuildNode } from './nodes';

class PromptOnlyProcess {
    #profile:Profile;
    #rtId:string;

    constructor(profile:Profile, rtId:string) {
        this.#profile = profile;
        this.#rtId = rtId;
    }

    async process(input:RTInput, workLog:WorkLog[]):Promise<any> {
        const globalOption:GlobalNodeOption = {
            profile : this.#profile,
            rtId : this.#rtId,
            modelId : '123',
        }
        
        workLog.push({ type : 'work_begin' });
        try {
            const promptBuildNode = new PromptBuildNode(0);
            const { prompt } = await promptBuildNode.run(input, { promptId:'default' }, globalOption, workLog);
            
            
        }
        finally {
            workLog.push({ type : 'work_end' });
        }

        // this.#chatAI.request({
        //     input,
        //     builtInVars,
        //     vars,
        //     model
        // });

        // return {
        //     builtInVars,
        //     vars,
        //     modelId,
        // };
    }
}

export default PromptOnlyProcess;