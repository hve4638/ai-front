import { Tokenizer } from '../expressionParser';
import { SyntaxTransformer, SyntaxToken } from '../expressionParser';

describe('SyntaxTransform Test', () => {
    const transform = (expressionText) => {
        const tokenizer = new Tokenizer(expressionText);
        const transformer = new SyntaxTransformer(tokenizer.tokenize());
        return transformer.transform();
    }
    test('number', ()=>{
        const actual = transform('1 + 2 - 3');
        const expected = [
            SyntaxToken.number('1'),
            SyntaxToken.number('2'),
            SyntaxToken.operator('+'),
            SyntaxToken.number('3'),
            SyntaxToken.operator('-'),
        ]
        expect(actual).toEqual(expected);
    });
    test('number with precedence', ()=>{
        const actual = transform('1 + 2 * 3 % 5');
        const expected = [
            SyntaxToken.number('1'),
            SyntaxToken.number('2'),
            SyntaxToken.number('3'),
            SyntaxToken.operator('*'),
            SyntaxToken.number('5'),
            SyntaxToken.operator('%'),
            SyntaxToken.operator('+'),
        ]
        expect(actual).toEqual(expected);
    });
    test('string', ()=>{
        const actual = transform('"hello" + \'world\'');
        const expected = [
            SyntaxToken.string('"hello"'),
            SyntaxToken.string('\'world\''),
            SyntaxToken.operator('+'),
        ]
        expect(actual).toEqual(expected);
    });
    test('function', ()=>{
        const actual = transform('function()');
        const expected = [
            SyntaxToken.identifier('function'),
            SyntaxToken.param(),
            SyntaxToken.operator('()'),
        ]
        expect(actual).toEqual(expected);
    })
    test('function with args', ()=>{
        const actual = transform('function(1, 2 + 3)');
        const expected = [
            SyntaxToken.identifier('function'),
            SyntaxToken.param(),
            SyntaxToken.number('1'),
            SyntaxToken.number('2'),
            SyntaxToken.number('3'),
            SyntaxToken.operator('+'),
            SyntaxToken.operator('()'),
        ]
        expect(actual).toEqual(expected);
    });
    test('sum with function', ()=>{
        const actual = transform('sum(1, 2) + 3');
        const expected = [
            SyntaxToken.identifier('sum'),
            SyntaxToken.param(),
            SyntaxToken.number('1'),
            SyntaxToken.number('2'),
            SyntaxToken.operator('()'),
            SyntaxToken.number('3'),
            SyntaxToken.operator('+'),
        ]
        expect(actual).toEqual(expected);
    })
    test('indexor 0', ()=>{
        const actual = transform('array[0]');
        const expected = [
            SyntaxToken.identifier('array'),
            SyntaxToken.number('0'),
            SyntaxToken.operator('[]'),
        ]
        expect(actual).toEqual(expected);
    });
    test('indexor 1', ()=>{
        const actual = transform('array[i + 1]');
        const expected = [
            SyntaxToken.identifier('array'),
            SyntaxToken.identifier('i'),
            SyntaxToken.number('1'),
            SyntaxToken.operator('+'),
            SyntaxToken.operator('[]'),
        ]
        expect(actual).toEqual(expected);
    });
    test('chain 1', ()=>{
        const actual = transform('data.get()');
        const expected = [
            SyntaxToken.identifier('data'),
            SyntaxToken.identifier('get'),
            SyntaxToken.operator('.'),
            SyntaxToken.param(),
            SyntaxToken.operator('()'),
        ]
        expect(actual).toEqual(expected);
    });
    test('chain 2', ()=>{
        const actual = transform('data.get()[1][2]');
        const expected = [
            SyntaxToken.identifier('data'),
            SyntaxToken.identifier('get'),
            SyntaxToken.operator('.'),
            SyntaxToken.param(),
            SyntaxToken.operator('()'),
            SyntaxToken.literal(1),
            SyntaxToken.operator('[]'),
            SyntaxToken.literal(2),
            SyntaxToken.operator('[]'),
        ]
        expect(actual).toEqual(expected);
    });
});
