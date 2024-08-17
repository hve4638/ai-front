import { CurlyBraceFormatParser } from ".."

const parseCBF = (promptTemplateText, args) => {
    const parser = new CurlyBraceFormatParser(promptTemplateText);
    return parser.build(args);
}
describe('CurlyBraceFormat Parse', ()=>{
    test('Plain text', ()=>{
        const template = `
            test prompt
        `
        const expected = ['test prompt'];
        const actual = parseCBF(template, {});
        
        expect(actual).toEqual(expected);
    });
    test('Expression', ()=>{
        const template = `
            {{1 + 2}}
        `
        const expected = ['3'];
        const actual = parseCBF(template, {});
        
        expect(actual).toEqual(expected);
    });
    test('Var', ()=>{
        const template = `
            {{num}}
        `
        const expected = ['10'];
        const actual = parseCBF(template, {
            vars : {
                'num' : 10
            }
        });
        
        expect(actual).toEqual(expected);
    });
    test('Reversed Var', ()=>{
        const template = `
            {{:input}}
        `
        const expected = ['hello world'];
        const actual = parseCBF(template, {
            builtInVars : {
                'input' : 'hello world'
            }
        });
        
        expect(actual).toEqual(expected);
    });
    test('If statement : true', ()=>{
        const template = `
            {{::if 1}}
                hello world
            {{::endif}}
        `
        const expected = ['hello world'];
        const actual = parseCBF(template, {});
        
        expect(actual).toEqual(expected);
    })
    test('If statement : false', ()=>{
        const template = `
            {{::if 0}}
                hello world
            {{::endif}}
        `
        const expected = [''];
        const actual = parseCBF(template, {});
        
        expect(actual).toEqual(expected);
    })
    test('If statement : variable', ()=>{
        const template = `
            {{::if num}}
                hello world
            {{::endif}}
        `
        const expected = [''];
        const actual = parseCBF(template, { vars: { num : 0, } });
        
        expect(actual).toEqual(expected);
    })
    test('Foreach statement', ()=>{
        const template = `
            {{::foreach chat in chats}}
                text : {{chat}}{{:nl}}
            {{::endforeach}}
        `
        const args = {
            builtInVars : {
                'nl' : '\n',
            },
            vars : {
                'chats' : {
                    array : [
                        'hello',
                        'world'
                    ],
                },
            },
            expressionEventHooks : {
                'indexor' : function(expr, index) {
                    const arr = expr.value.array;

                    return arr.at(index.value as number);
                },
                'iterate' : function(expr) {
                    return expr.value.array;
                }
            }
        }
        
        const expected = ['text : hello\ntext : world\n'];
        const actual = parseCBF(template, args);
        
        expect(actual).toEqual(expected);
    })
})

describe('CurlyBraceFormat text trmming', ()=>{
    test('Variable substitution and trimming', ()=>{
        const template = `
            hello {{text}}
        `
        const expected = ['hello world'];
        const actual = parseCBF(template, { vars: { text : 'world', } });
        
        expect(actual).toEqual(expected);
    })
    test('Directive handling and trimming', ()=>{
        const template = `
            {{::role user}}
                your role is user
            {{::role model}}
                your role is model
        `
        const expected = ['your role is user', 'your role is model'];
        const actual = parseCBF(template, {});
        
        expect(actual).toEqual(expected);
    })
    test('Null trimming', ()=>{
        const template = `
            {{:blank}} hello world  {{:blank}}
        `
        const expected = [' hello world  '];
        const actual = parseCBF(template, { builtInVars:{ blank : '' }});
        
        expect(actual).toEqual(expected);
    })
})