import { IdentifierError, NoHookError, UnsupportedOperator } from '../error';
import { ExpressionEvaluator } from '../expressionEvaluator';
import { ExpressionParser, ExpressionType, IdentifierExpression, LiteralExpression, ObjectExpression, ParamExpression, CallExpression, SyntaxTransformer, Tokenizer } from '../expressionParser';
import type { ExpressionArgs } from '../interface';

const EMPTY_ARGS = {
    vars : {},
    expressionEventHooks : {},
    builtInVars:{},
    currentScope : {}
} as ExpressionArgs;

const evaluate = (expressionText, exprArgs:ExpressionArgs) => {
    const tokenizer = new Tokenizer(expressionText);
    const transformer = new SyntaxTransformer(tokenizer.tokenize());
    const expressionParser = new ExpressionParser(transformer.transform());
    const evaluator = new ExpressionEvaluator(exprArgs);
    
    return evaluator.evaluate(expressionParser.parse());
}
const evaluateAndStringify = (expressionText, exprArgs:ExpressionArgs) => {
    const tokenizer = new Tokenizer(expressionText);
    const transformer = new SyntaxTransformer(tokenizer.tokenize());
    const expressionParser = new ExpressionParser(transformer.transform());
    const evaluator = new ExpressionEvaluator(exprArgs);
    
    return evaluator.evaluateAndStringify(expressionParser.parse());
}
const evaluateAndIterate = (expressionText, exprArgs:ExpressionArgs) => {
    const tokenizer = new Tokenizer(expressionText);
    const transformer = new SyntaxTransformer(tokenizer.tokenize());
    const expressionParser = new ExpressionParser(transformer.transform());
    const evaluator = new ExpressionEvaluator(exprArgs);
    
    return evaluator.evaluateAndIterate(expressionParser.parse());
}

const handleAndGetError = (callback) => {
    try {
        callback();
        
        throw new Error('Expected error but not thrown');
    }
    catch(e:any) {
        return e;
    }
}

describe('evaluateError', () => {
    const identifierExpression = (value) => {
        return {
            type : ExpressionType.IDENTIFIER,
            value : value
        }
    }

    test('No variable defined', () => {
        const error = new IdentifierError('Variable is not defined', identifierExpression('num'));

        try {
            evaluate('num', EMPTY_ARGS); // expected error
            
            throw new Error('Expected error but not thrown');
        }
        catch(e:any) {
            expect(e.name).toEqual(error.name);
            expect(e.expression).toEqual(error.expression);
        }
    });
    
    test('Invalid built-in variable', () => {
        const error = new IdentifierError('Invalid bulit-in variable', identifierExpression(':chat'));
        try {
            evaluate(':chat', EMPTY_ARGS); // expected error
            
            throw new Error('Expected error but not thrown');
        }
        catch(e:any) {
            expect(e.name).toEqual(error.name);
            expect(e.expression).toEqual(error.expression);
        }
    });

    test('No eventhook', () => {
        const error = new NoHookError(
            'call',
        {
            type : ExpressionType.CALL,
            value : '()',
            operands : [
                {
                    type : ExpressionType.IDENTIFIER,
                    value : 'num'
                } as IdentifierExpression,
                {
                    type : ExpressionType.PARAM,
                    args : []
                } as ParamExpression,
            ]
        } as CallExpression);

        try {
            evaluate('num()', {
                ...EMPTY_ARGS,
                vars : {
                    num : {}
                },
            }); // expected error
            
            throw new Error('Expected error but not thrown');
        }
        catch(e:any) {
            expect(e.name).toEqual(error.name);
            expect(e.message).toEqual(error.message);
            expect(e.hookName).toEqual(error.hookName);
            expect(e.expression).toEqual(error.expression);
        }
    });

    test('no eventhook : stringify', () => {
        const expected = new NoHookError(
            'stringify',
            {
                type : ExpressionType.OBJECT,
                value : {}
            } as ObjectExpression
        );
        const actual = handleAndGetError(
            ()=>evaluateAndStringify('num', {
                ...EMPTY_ARGS,
                vars : {
                    num : {}
                },
            })
        );
        
        expect(actual.name).toEqual(expected.name);
        expect(actual.message).toEqual(expected.message);
        expect(actual.hookName).toEqual(expected.hookName);
        expect(actual.expression).toEqual(expected.expression);
    });

    test('try iterate literal', () => {
        const expected = new UnsupportedOperator(
            'iterate',
            {
                type : ExpressionType.LITERAL,
                value : 5
            } as LiteralExpression
        );
        const actual = handleAndGetError(()=>evaluateAndIterate('5', EMPTY_ARGS));
        
        expect(actual.name).toEqual(expected.name);
        expect(actual.message).toEqual(expected.message);
        expect(actual.expression).toEqual(expected.expression);
    });
});

