import { Tokenizer } from '../expressionParser/tokenizer';

const tokenize = (expressionText) => {
    const parser = new Tokenizer(expressionText);
    return parser.tokenize();
}
const token = (type, value) => {return {type, value}}

describe('Tokenizer Error Test', () => {
    test('Invalid token', ()=>{
        const expressionText = '1a';
        try {
            tokenize(expressionText); // expected error
            
            throw new Error('Expected error but not thrown');
        }
        catch (e: any) {
            expect(e.name).toBe('TokenizeFailError');
            expect(e.message).toBe('Invalid token');
            expect(e.expressionText).toBe(expressionText);
            expect(e.position).toBe(0);
        }
    });

    test('Invalid operator', ()=>{
        const expressionText = 'a @ b';
        try {
            tokenize(expressionText); // expected error
            
            throw new Error('Expected error but not thrown');
        }
        catch (e: any) {
            expect(e.name).toBe('TokenizeFailError');
            expect(e.message).toBe('Invalid token');
            expect(e.expressionText).toBe(expressionText);
            expect(e.position).toBe(2);
        }
    });
})