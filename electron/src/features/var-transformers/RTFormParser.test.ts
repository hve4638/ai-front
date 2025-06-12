import RTFormParser from './RTFormParser';

describe('RTFormParser', () => {
    const tables:{ promptVar:PromptVar, form:RTForm  }[] = [
        {
            promptVar : {
                type : 'text',
                id : '0',
                name : '',
                display_name : 'test 1',
                default_value : 'hello world',
                placeholder : 'empty',
                allow_multiline : false,
            },
            form : {
                type : 'text',
                id : '0',
                display_name : 'test 1',
                display_on_header : false,
                
                config : {
                    text : {
                        default_value : 'hello world',
                        placeholder : 'empty',
                        allow_multiline : false,
                    }
                }
            }
        }
    ]

    test.each(tables)('promptVarToRTForm', ({ promptVar, form }) => {
        const result = RTFormParser.toPromptVar(form);
        expect(result).toEqual(promptVar);
    });
});