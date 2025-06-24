import { UserInput } from './types';
import WorkNode from './WorkNode';

export type InputNodeInput = {

}
export type InputNodeOutput = {
    input: UserInput;
}
export type InputNodeOption = {
    inputType: 'chat' | 'normal';
}

/**
 * 필수 노드
 * 
 * 사용자 입력 텍스트 및 파일 출력 및 history 기록
 */
class InputNode extends WorkNode<InputNodeInput, InputNodeOutput, InputNodeOption> {
    override name = 'InputNode';

    override async process({ }) {
        const { form, data, chat, inputFiles, inputText } = this.nodeData;

        for (const f of inputFiles) {
            if (f.type.startsWith('image/')) {
                data.input.push({
                    type: 'image_base64',
                    data: f.data,
                    token_count: 0,
                });
            }
            else {
                data.input.push({
                    type: 'file_base64',
                    data: f.data,
                    token_count: 0,
                });
            }
        }
        data.input.push({
            type: 'text',
            text: inputText,
            token_count: 0,
        });

        return {
            input: {
                text: inputText,
                files: inputFiles,
            }
        }
    }
}

export default InputNode;