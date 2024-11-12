import { Tokenizer } from '../expressionParser';
import { SyntaxTransformer, SyntaxToken } from '../expressionParser';
import { SyntaxTransformFailError } from '../expressionParser/error';

const transform = (expressionText) => {
    const tokenizer = new Tokenizer(expressionText);
    const transformer = new SyntaxTransformer(tokenizer.tokenize());
    return transformer.transform();
}

describe('SyntaxTransform Test', () => {
    test('Duplicate Expression', ()=>{ 
        const expressionText = 'a, b';
        try {
            transform(expressionText);
        }
        catch (e: any) {
            expect(e).toBeInstanceOf(SyntaxTransformFailError);
            expect(e.token).toEqual({ type: 'DELIMITER', value: ',' });
        }
    });
});