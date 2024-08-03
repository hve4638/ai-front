import { SyntaxTokenType } from "./syntaxToken";

export const ExpressionTokenType = {
    LITERAL: SyntaxTokenType.LITERAL,
    IDENTIFIER: SyntaxTokenType.IDENTIFIER,
    OBJECT : SyntaxTokenType.OBJECT,
    PARAM: SyntaxTokenType.PARAM,
    CALL: 'CALL',
    CUSTOM: 'CUSTOM',
    
} as const;
export const ExpressionType = ExpressionTokenType;

interface BaseExpression {
    readonly type: 'CALL' | 'PARAM' | 'LITERAL' | 'IDENTIFIER' | 'OBJECT';
}

interface CallExpression extends BaseExpression {
    readonly type : 'CALL';
    readonly value : string;
    readonly operands : BaseExpression[];
}
interface ParamExpression extends BaseExpression {
    readonly type : 'PARAM';
    readonly args :  BaseExpression[];
}
interface LiteralExpression extends BaseExpression {
    readonly type : 'LITERAL';
    readonly value : string|number|boolean;
}
interface IdentifierExpression extends BaseExpression {
    readonly type : 'IDENTIFIER';
    readonly value : string;
}
interface ObjectExpression extends BaseExpression {
    readonly type : 'OBJECT';
    readonly value : any;
}

export type {
    BaseExpression,
    CallExpression,
    ParamExpression,
    LiteralExpression,
    IdentifierExpression,
    ObjectExpression
}