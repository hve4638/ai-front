import { AnyExpression } from "./expressionParser/expressionInterface";

export class ExpressionEvaluateFailError extends Error {
    expression:AnyExpression;
    
    constructor(message:string, expression:AnyExpression) {
        super(message);
        this.name = 'ExpressionEvaluateFailError';
        this.expression = expression;
    }
}

export class NoHookError extends ExpressionEvaluateFailError {
    hookName:string;
    
    constructor(hookName:string, expression:AnyExpression) {
        super(`No hook available '${hookName}'`, expression);
        this.name = 'NoHookError';
        this.hookName = hookName;
    }
}

export class IdentifierError extends ExpressionEvaluateFailError {
    constructor(message:string, expression:AnyExpression) {
        super(message, expression);
        this.name = 'IdentifierError';
    }
}


export class UnsupportedOperator extends ExpressionEvaluateFailError {
    constructor(operator: string, expression: AnyExpression) {
        super(`Unsupported Operator '${operator}' for this type`, expression);
        this.name = 'InvalidOperatorError';
    }
}

// 방어적 프로그래밍을 위한 코드
// 코드 로직이 정상이라면 사용자 입력과 관계없이 발생하지 않음
// 외부 인자에 의해 발생할 수 있으므로 LogicError와 구분됨
export class InvalidExpressionError extends ExpressionEvaluateFailError {
    constructor(message:string, expression:AnyExpression) {
        super(message, expression);
        this.name = 'InvalidExpressionError';
    }
}
