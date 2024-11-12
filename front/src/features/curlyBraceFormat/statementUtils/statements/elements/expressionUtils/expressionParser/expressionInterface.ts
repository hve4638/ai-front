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

type AnyExpression = EvaluatableExpression | UnevaluatableExpression;
type EvaluatableExpression = CallExpression | LiteralExpression |  ObjectExpression;
type UnevaluatableExpression = IdentifierExpression | ParamExpression;

interface CallExpression {
    readonly type : 'CALL';
    readonly value : string;
    readonly operands : AnyExpression[];
}
interface LiteralExpression {
    readonly type : 'LITERAL';
    readonly value : string|number|boolean;
}
interface ObjectExpression {
    readonly type : 'OBJECT';
    readonly value : any;
}
interface IdentifierExpression {
    readonly type : 'IDENTIFIER';
    readonly value : string;
}
interface ParamExpression {
    readonly type : 'PARAM';
    readonly args : EvaluatableExpression[];
}

export type {
    AnyExpression,
    EvaluatableExpression,
    UnevaluatableExpression,
    CallExpression,
    ParamExpression,
    LiteralExpression,
    IdentifierExpression,
    ObjectExpression
}