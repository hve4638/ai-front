import WorkNode from './WorkNode';

export type InputNodeInput = {
    
}
export type InputNodeOutput = {
    input :string;
    chat?:RTInputMessage[];
    form?:Record<string, any>;
}
export type InputNodeOption = {
    inputType:'chat'|'normal';
}

class InputNode extends WorkNode<InputNodeInput, InputNodeOutput, InputNodeOption>  {
    override async process({}) {
        const { inputType } = this.option;
        const { form, input, chat } = this.nodeData;

        this.nodeData.historyRequired.input.push({
            type: 'text',
            text: input,
            data: '',
            token_count: 0,
        });
        this.nodeData.historyRequired.form = form;
        
        if (inputType === 'chat') {
            this.nodeData.historyRequired.chat_type = 'chat';

            if (!chat) throw new Error('Chat is not defined in input.');

            const merged: RTInputMessage[] = [
                ...chat,
                {
                    type: 'chat',
                    message: [
                        {
                            type: 'text',
                            value: input,
                        }
                    ]
                }
            ]
            
            return {
                input: input,
                chat: merged,
                form: form,
            };
        }
        else if (inputType === 'normal') {
            this.nodeData.historyRequired.chat_type = 'normal';

            return {
                input: input,
                chat: [],
                form: form,
            };
        }
        else {
            throw new Error(`Invalid input type: ${inputType}`);
        }
    }
}

export default InputNode;