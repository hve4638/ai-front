type TokenizeFailArgs = {
    expressionText:string;
    position:number;
}

export class TokenizeFailError extends Error {
    expressionText:string;
    position:number;

    constructor(message:string, {expressionText, position}:TokenizeFailArgs) {
        super(message);
        this.name = 'TokenizeFailError';
        this.expressionText = expressionText;
        this.position = position;
    }
}

type Token = { type:string, value:string }

export class SyntaxTransformFailError extends Error {
    tokens:Token[]; // 전체 토큰
    token?:Token; // 에러 발생 토큰

    constructor(message:string, {tokens, token}:{tokens:Token[], token?:Token}) {
        super(message);
        this.name = 'SyntaxTransformFailError';
        this.tokens = tokens;
        this.token = token;
    }
}

export class ExpressionParseFailError extends Error {
    constructor(message:string) {
        super(message);
        this.name = 'ExpressionParseFailError';
    }
}