import { Tokenizer } from '../expressionParser/tokenizer';

const tokenize = (expressionText) => {
    const parser = new Tokenizer(expressionText);
    return parser.tokenize();
}
const token = (type, value) => {return {type, value}}

describe('Tokenizer Test', () => {
    test('number', ()=>{
        const actual = tokenize('10');
        const expected = [
            token('NUMBER', '10')
        ]
        expect(actual).toEqual(expected);
    });
    test('string', ()=>{
        const actual = tokenize('"hello world"');
        const expected = [
            token('STRING', '"hello world"')
        ]
        expect(actual).toEqual(expected);
    });
    test('operator', ()=>{
        const actual = tokenize('1 + 1.5');
        const expected = [
            token('NUMBER', '1'),
            token('OPERATOR', '+'),
            token('NUMBER', '1.5'),
        ]
        expect(actual).toEqual(expected);
    })
    test('name', ()=>{
        const actual = tokenize('variable');
        const expected = [
            token('IDENTIFIER', 'variable'),
        ]
        expect(actual).toEqual(expected);
    });
    test('name and field', ()=>{
        const actual = tokenize('variable.name');
        const expected = [
            token('IDENTIFIER', 'variable'),
            token('OPERATOR', '.'),
            token('IDENTIFIER', 'name'),
        ]
        expect(actual).toEqual(expected);
    });
    test('name and function', ()=>{
        const actual = tokenize('variable.func()');
        const expected = [
            token('IDENTIFIER', 'variable'),
            token('OPERATOR', '.'),
            token('IDENTIFIER', 'func'),
            token('PAREN', '('),
            token('PAREN', ')'),
        ]
        expect(actual).toEqual(expected);
    });
    test('function with args', ()=>{
        const actual = tokenize('func(i, 10)');
        const expected = [
            token('IDENTIFIER', 'func'),
            token('PAREN', '('),
            token('IDENTIFIER', 'i'),
            token('DELIMITER', ','),
            token('NUMBER', '10'),
            token('PAREN', ')'),
        ]
        expect(actual).toEqual(expected);
    });
    test('indexor', ()=>{
        const actual = tokenize('array[0]');

        const expected = [
            token('IDENTIFIER', 'array'),
            token('INDEXOR', '['),
            token('NUMBER', '0'),
            token('INDEXOR', ']'),
        ]
        expect(actual).toEqual(expected);
    });
    test('expression in indexor', ()=>{
        const actual = tokenize('array[10 + i]');
        const expected = [
            token('IDENTIFIER', 'array'),
            token('INDEXOR', '['),
            token('NUMBER', '10'),
            token('OPERATOR', '+'),
            token('IDENTIFIER', 'i'),
            token('INDEXOR', ']'),
        ]
        expect(actual).toEqual(expected);
    });
});


describe('Tokenizer builtInVar Test', () => {
    test('var', ()=>{
        const actual = tokenize(':var');
        const expected = [
            token('IDENTIFIER', ':var'),
        ]
        expect(actual).toEqual(expected);
    });
    test('accessor', ()=>{
        const actual = tokenize(':var.length');
        const expected = [
            token('IDENTIFIER', ':var'),
            token('OPERATOR', '.'),
            token('IDENTIFIER', 'length'),
        ]
        expect(actual).toEqual(expected);
    });
    test('indexor', ()=>{
        const actual = tokenize(':var[0]');
        const expected = [
            token('IDENTIFIER', ':var'),
            token('INDEXOR', '['),
            token('NUMBER', '0'),
            token('INDEXOR', ']'),
        ]
        expect(actual).toEqual(expected);
    });
    test('caller', ()=>{
        const actual = tokenize(':var()');
        const expected = [
            token('IDENTIFIER', ':var'),
            token('PAREN', '('),
            token('PAREN', ')'),
        ]
        expect(actual).toEqual(expected);
    });
})