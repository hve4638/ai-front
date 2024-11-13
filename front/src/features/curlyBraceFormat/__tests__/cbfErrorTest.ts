import { CurlyBraceFormatParser } from '../'
import { CBFParseError } from '../errors';
import { CBFRawErrorWarper } from '../cbfRawErrorWarper'

class ExpectedButNotThrownError extends Error {
    constructor() {
        super('Expected error but not thrown');
    }
}

export function handleAndGetError(callback) {
    try {
        callback();
        
        throw new ExpectedButNotThrownError();
    }
    catch(e:any) {
        if (e instanceof ExpectedButNotThrownError) {
            throw e;
        }
        return e;
    }
}

const parseCBF = (promptTemplateText, args) => {
    const parser = new CurlyBraceFormatParser(promptTemplateText);
    return parser.build(args);
}

describe('CBFRawErrorWarper : splite position', ()=>{
    const cbfRawErrorWarper = new CBFRawErrorWarper();
    const calc = (position:number, text:string) => {
        return cbfRawErrorWarper.splitPositionToLineColumn(position, text);
    }
    const result = (line, column) => {
        return [line, column];
    }

    test('no nl', ()=>{
        expect(calc(0, 'hello')).toEqual(result(0, 0));
        expect(calc(1, 'hello')).toEqual(result(0, 1));
        expect(calc(2, 'hello')).toEqual(result(0, 2));
        expect(calc(3, 'hello')).toEqual(result(0, 3));
        expect(calc(4, 'hello')).toEqual(result(0, 4));

        expect(calc(5, 'hello')).toEqual(result(0, 4)); // out of range
    });
    test('has nl', ()=>{
        expect(calc(0, 'hello\nworld')).toEqual(result(0, 0));
        expect(calc(4, 'hello\nworld')).toEqual(result(0, 4));
        expect(calc(5, 'hello\nworld')).toEqual(result(1, 0));
        expect(calc(9, 'hello\nworld')).toEqual(result(1, 4));
        expect(calc(10, 'hello\nworld')).toEqual(result(1, 4)); // out of range
    });
    test('has multiple nl', ()=>{
        expect(calc(0, 'hello\n\nworld')).toEqual(result(0, 0));
        expect(calc(4, 'hello\n\nworld')).toEqual(result(0, 4));
        expect(calc(5, 'hello\n\nworld')).toEqual(result(2, 0));
        expect(calc(9, 'hello\n\nworld')).toEqual(result(2, 4));
        expect(calc(10, 'hello\n\nworld')).toEqual(result(2, 4)); // out of range
    });
    test('first nl', ()=>{
        expect(calc(0, '\nworld')).toEqual(result(1, 0));
        expect(calc(0, '\n\nworld')).toEqual(result(2, 0));
        expect(calc(0, '\n\n\nworld')).toEqual(result(3, 0));
    });
    test('last nl', ()=>{
        expect(calc(0, 'hello\n')).toEqual(result(0, 0));
        expect(calc(4, 'hello\n')).toEqual(result(0, 4));
        expect(calc(5, 'hello\n')).toEqual(result(0, 4)); // out of range
    });
});

describe('CBFParseError Handle', ()=>{
    const expectCBFError = (actual:any, expected:CBFParseError) => {
        expect(actual).toBeInstanceOf(CBFParseError);
        expect(actual.name).toEqual(expected.name);
        //expect(actual.message).toEqual(expected.message);
        if (expected.line === undefined
        && expected.column === undefined
        && expected.text === undefined) {
            return;
        }

        expect({
            line : actual.line,
            column : actual.column,
            text : actual.text
        }).toEqual({
            line : expected.line,
            column : expected.column,
            text : expected.text
        });
    }

    test('tokenize fail', ()=>{
        const expected = new CBFParseError(
            'Syntax Error : Invalid symbol',
            {line:1, column:0, text:'1a'}
        );
        
        const template = `{{ 1a }}`
        const actual = handleAndGetError(()=>parseCBF(template, {}));
        expectCBFError(actual, expected);
    });
    test('Duplicate result in single expression', ()=>{
        const expected = new CBFParseError('Syntax Error : Multiple value in a single expression are not allowed', {
            line:1, column:0, text:'{{a, b}}'
        });

        const template = `{{a, b}}`
        const actual = handleAndGetError(()=>parseCBF(template, {}));
        expectCBFError(actual, expected);
    });
    test('Variable not defined',()=>{
        const expected = new CBFParseError('Build Error : Variable is not defined', {
            line:1, column:0, text:'{{num}}'
        });

        const template = `{{num}}`
        const actual = handleAndGetError(()=>parseCBF(template, {}));
        expectCBFError(actual, expected);
    });
    test('Invalid built-in variable',()=>{
        const expected = new CBFParseError('Build Error : Invalid built-in variable', {
            line:1, column:0, text:'{{:num}}'
        });

        const template = `{{:num}}`
        const actual = handleAndGetError(()=>parseCBF(template, {}));
        expectCBFError(actual, expected);
    });
    test('Build error in if block',()=>{
        const expected = new CBFParseError('Build Error : Variable is not defined', {
            line:2, column:0, text:'{{num}}'
        });

        let template = ''
        template += '{{::if 1}}\n'
        template += '{{num}}\n'
        template += '{{::endif}}\n'
        const actual = handleAndGetError(()=>parseCBF(template, {}));
        expectCBFError(actual, expected);
    });
    test('Build error in if condition', ()=>{
        const expected = new CBFParseError('Build Error : Variable is not defined', {
            line:1, column:0, text:'{{::if num}}'
        });

        let template = ''
        template += '{{::if num}}\n'
        template += '{{::endif}}\n'
        const actual = handleAndGetError(()=>parseCBF(template, {}));
        expectCBFError(actual, expected);
    });
    test('No endif', ()=>{
        const expected = new CBFParseError('Build Error : Unexpected end of prompt', {});

        let template = ''
        template += '{{::if 1}}\n';
        const actual = handleAndGetError(()=>parseCBF(template, {}));
        expectCBFError(actual, expected);
    });

    test('No hook',()=>{
        const expected = new CBFParseError('Build Error : No hook available \'call\'', {
            line:1, column:0, text:'{{num()}}'
        });

        const template = `{{num()}}`
        const actual = handleAndGetError(()=>parseCBF(template, {
            vars : {
                num : {}
            }
        }));
        expectCBFError(actual, expected);
    });
    test('Unsupported Operator',()=>{
        const expected = new CBFParseError('Build Error : Unsupported Operator \'.\' for this type', {
            line:1, column:0, text:'{{num.get}}'
        });

        const template = `{{num.get}}`
        const actual = handleAndGetError(()=>parseCBF(template, {
            vars : {
                num : 10
            }
        }));
        expectCBFError(actual, expected);
    });
    test('Unsupported Operator',()=>{
        const expected = new CBFParseError('Build Error : Unsupported Operator \'.\' for this type', {
            line:1, column:0, text:'{{num.get}}'
        });

        const template = `{{num.get}}`
        const actual = handleAndGetError(()=>parseCBF(template, {
            vars : {
                num : 10
            }
        }));
        expectCBFError(actual, expected);
    });
});