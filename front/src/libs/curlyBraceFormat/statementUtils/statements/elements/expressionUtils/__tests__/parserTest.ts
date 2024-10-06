import { ExpressionParser, Tokenizer, SyntaxTransformer, SyntaxToken } from '../expressionParser';

describe('ExpressionParser Test', () => {
    const parse = (expressionText) => {
        const tokenizer = new Tokenizer(expressionText);
        const transformer = new SyntaxTransformer(tokenizer.tokenize());
        const parser = new ExpressionParser(transformer.transform());
        return parser.parse();
    }

    test('add expr', ()=>{
        const actual = parse('1 + 2');
        const expected = callExpr(
            '+',
            [
                SyntaxToken.literal(1),
                SyntaxToken.literal(2),
            ]
        )
        expect(actual).toEqual(expected);
    });
    test('combine expr', ()=>{
        const actual = parse('1 + 2 * 3 - 4');
        const expected = callExpr('-',
            [
                callExpr('+',
                    [
                        SyntaxToken.literal(1),
                        callExpr('*', [
                            SyntaxToken.literal(2),
                            SyntaxToken.literal(3),
                        ]),
                    ]
                ),
                SyntaxToken.literal(4)
            ]
        )
        expect(actual).toEqual(expected);
    });
    test('function', ()=>{
        const actual = parse('function()');
        const expected = callExpr('()',
            [
                SyntaxToken.identifier('function'),
                argsExpr([])
            ]
        )
        expect(actual).toEqual(expected);
    });
    test('function with param', ()=>{
        const actual = parse('function(1, 2 + 3)');
        const expected = callExpr('()',
            [
                SyntaxToken.identifier('function'),
                argsExpr(
                    [
                        SyntaxToken.literal(1),
                        callExpr('+', [
                            SyntaxToken.literal(2),
                            SyntaxToken.literal(3),
                        ]),
                    ]
                )
            ]
        )
        expect(actual).toEqual(expected);
    });
    test('indexor', ()=>{
        const actual = parse('array[1+2]');
        const expected = callExpr('[]',
            [
                SyntaxToken.identifier('array'),
                callExpr('+',
                    [
                        SyntaxToken.literal(1),
                        SyntaxToken.literal(2)
                    ]
                )
            ]
        )
        expect(actual).toEqual(expected);
    });
    test('access', ()=>{
        const actual = parse('object.key');
        const expected = callExpr('.',
            [
                SyntaxToken.identifier('object'),
                SyntaxToken.literal('key'),
            ]
        )
        expect(actual).toEqual(expected);
    });
    test('chain : access, call', ()=>{
        const actual = parse('data.get()');
        const expected = callExpr('()',
            [
                callExpr('.',
                    [
                        SyntaxToken.identifier('data'),
                        SyntaxToken.literal('get'),
                    ]
                ),
                argsExpr([])
            ]
        )
        expect(actual).toEqual(expected);
    })
    test('chain : access, call, indexor', ()=>{
        const actual = parse('data.get()[1][2]');
        const expected = callExpr('[]',
            [
                callExpr('[]',
                    [
                        callExpr('()',
                            [
                                callExpr('.',
                                    [
                                        SyntaxToken.identifier('data'),
                                        SyntaxToken.literal('get'),
                                    ]
                                ),
                                argsExpr([])
                            ]
                        ),
                        SyntaxToken.literal(1)
                    ]
                ),
                SyntaxToken.literal(2)
            ]
        )
        expect(actual).toEqual(expected);
    });
    
});

const callExpr = (value, operands) => {
    return {
        type : 'CALL',
        value : value,
        operands : operands
    }
}

const argsExpr = (args) => {
    return {
        type : 'PARAM',
        args : args
    }
}