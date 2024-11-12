export const SyntaxTokenType = {
    LITERAL : 'LITERAL',
    IDENTIFIER : 'IDENTIFIER',
    OPERATOR : 'OPERATOR',
    PARAM : 'PARAM',
    CUSTOM : 'CUSTOM',
    OBJECT : 'OBJECT',
    DELIMITER : 'DELIMITER'
} as const;

export class SyntaxToken {
    static #STRING_PATTERN = /^('|")(.*)\1$/
    static param() {
        return {
            type : SyntaxTokenType.PARAM,
            value : '',
        }
    }
    static literal(value:string|number|boolean) {
        return {
            type : SyntaxTokenType.LITERAL,
            value : value,
        }
    }
    static string(value:string) {
        const group = value.match(SyntaxToken.#STRING_PATTERN);
        if (group) {
            return SyntaxToken.literal(group[2]);
        }
        else {
            throw new Error('Invalid expression')
        }
    }
    static number(value:string) {
        return SyntaxToken.literal(Number(value));
    }
    static identifier(value:string) { // 변수?
        return {
            type : SyntaxTokenType.IDENTIFIER,
            value : value
        }
    }
    static operator(value:string) {
        return {
            type : SyntaxTokenType.OPERATOR,
            value : value
        }
    }
    static delimiter(value) {
        return {
            type : SyntaxTokenType.DELIMITER,
            value : value
        }
    }
    static custom(value:string) {
        return {
            type : SyntaxTokenType.CUSTOM,
            value : value
        }
    }
    static object(value:object) {
        return {
            type : SyntaxTokenType.OBJECT,
            value : value
        }
    }
}