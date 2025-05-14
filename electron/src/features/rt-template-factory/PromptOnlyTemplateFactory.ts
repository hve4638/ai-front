import { Profile } from '../profiles';
import { RTPromptOnlyTemplateTool } from './tool';

class PromptOnlyTemplateFactory {
    private static async createTool(profile: Profile, rtId: string, name: string) {
        const tool = new RTPromptOnlyTemplateTool(profile);

        return await tool.create(rtId.trim(), name.trim());
    }

    static async empty(profile: Profile, rtId: string, name: string) {
        await this.createTool(profile, rtId, name);;
    }
    static async normal(profile: Profile, rtId: string, name: string) {
        const tool = await this.createTool(profile, rtId, name);

        await tool.contents(
            '{{:input}}'
        );
    }
    static async chat(profile: Profile, rtId: string, name: string) {
        const tool = await this.createTool(profile, rtId, name);

        await tool.contents(
            '{{:chat}}',
            '',
            '{{::role user}}',
            '',
            '{{:input}}',
        );
    }
    static async translate(profile: Profile, rtId: string, name: string) {
        const tool = await this.createTool(profile, rtId, name);

        await tool.contents(
            '{{::role system}}',
            '',
            'You are a translator. You need to translate the given sentence perfectly into {{lang}}.',
            '',
            '{{::role user}}',
            '',
            '{{:input}}',
            '',
            '{{::if prefill_enabled}}',
            '   ',
            '   {{::role assistant}}',
            '   ',
            '   Output:',
            '   ',
            '{{::endif}}',
        );
    }
    static async debug(profile: Profile, rtId: string, name: string) {
        const tool = await this.createTool(profile, rtId, name);

        await tool.contents(
            'user-input : {{:input}}',
            '',
            '<form>',
            '- input : {{input}}',
            '- struct.key : {{struct.key}}',
            '- struct.value : {{struct.value}}',
            '',
            '',
            '{{::foreach ele in array}}',
            '- one : {{ele.field0}}',
            '{{::endforeach}}',
        );
        await tool.form(
            {
                name: 'input',
                display_name: '입력값',
                type: 'text',
                default_value: '',
                placeholder: '입력값을 입력하세요',
                allow_multiline: false,
            },
            {
                name: 'struct',
                display_name: '구조체',
                type: 'struct',
                fields: [
                    {
                        name: 'key',
                        display_name: '키',
                        type: 'number',
                        default_value: 0,
                        allow_decimal: false,
                    },
                    {
                        name: 'value',
                        display_name: '값',
                        type: 'text',
                        default_value: '',
                        placeholder: '값을 입력하세요',
                        allow_multiline: false,
                    }
                ]
            },
            {
                name: 'array',
                display_name: '배열',
                type: 'array',
                element: {
                    name: 'key',
                    display_name: '키',
                    type: 'struct',
                    fields: [
                        {
                            name: 'field0',
                            display_name: '필드0',
                            type: 'text',
                            default_value: '',
                            placeholder: '값을 입력하세요',
                            allow_multiline: false,
                        },
                        {
                            name: 'field1',
                            display_name: '필드1',
                            type: 'number',
                            default_value: 0,
                            allow_decimal: false,
                        }
                    ]
                }
            }
        );
    }
}

export default PromptOnlyTemplateFactory;