import WorkNode from './WorkNode';

export type InputNodeInput = {
    
}
export type InputNodeOutput = {
    input?:string;
    chat?:RTInputMessage[];
    form?:Record<string, any>;
}
export type InputNodeOption = {
    inputType:'chat'|'normal';
}

class InputNode extends WorkNode<InputNodeInput, InputNodeOutput, InputNodeOption>  {
    override async process({}) {
        const { inputType } = this.option;
        const { message, form } = this.nodeData.rtInput;

        if (inputType === 'chat') { 
            const { message } = this.nodeData.rtInput;
            return {
                chat: message as unknown as RTInputMessage[],
                form: form,
            };
        }
        else if (inputType === 'normal') {
            return {
                input: message.at(-1)?.message[0].value ?? '',
                form: form,
            };
        }
        else {
            throw new Error(`Invalid input type: ${inputType}`);
        }
    }
}

export default InputNode;