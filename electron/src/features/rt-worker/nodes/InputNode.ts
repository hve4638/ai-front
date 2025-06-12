import WorkNode from './WorkNode';

export type InputNodeInput = {
    
}
export type InputNodeOutput = {
    input :string;
    // chat?:RTInputMessage[];
    // form?:Record<string, any>;
}
export type InputNodeOption = {
    inputType:'chat'|'normal';
}

class InputNode extends WorkNode<InputNodeInput, InputNodeOutput, InputNodeOption>  {
    override name = 'InputNode';
    
    override async process({}) {
        const { form, data, chat } = this.nodeData;
        
        return {
            input : data.input[0].text ?? '',
        }
    }
}

export default InputNode;