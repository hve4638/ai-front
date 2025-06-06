import { Profile } from '../profiles'
import { v7 as uuidv7 } from 'uuid';

export class RTPromptOnlyTemplateTool {
    rtId:string = '';

    constructor(private profile:Profile) {

    }

    async create(rtId:string, name:string) {
        this.rtId = (rtId.length > 0) ? rtId : uuidv7()
        await this.profile.addRT({
            name,
            id : this.rtId,
            mode : 'prompt_only',
        });
        return this;
    }

    async inputType(inputType:'chat'|'normal') {
        const rt = this.profile.rt(this.rtId);
        await rt.setMetadata({ 'input_type' : inputType });

        return this;
        
    }

    async contents(...line:string[]) {
        const prompt = line.join('\n');

        const rt = this.profile.rt(this.rtId);
        await rt.setPromptContents('default', prompt);

        return this;
    }

    async form(...vars:PromptVar[]) {
        const rt = this.profile.rt(this.rtId);
        await rt.setPromptVariables('default', vars);

        return this;
    }
}