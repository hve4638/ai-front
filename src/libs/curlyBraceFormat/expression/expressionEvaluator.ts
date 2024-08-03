import { SyntaxToken, ExpressionType, BaseExpression, IdentifierExpression, LiteralExpression, ObjectExpression, CallExpression, ParamExpression } from './expressionParser';

const LITERAL_ACTIONS = {
    '+' : (a, b)=>a+b,
    '-' : (a, b)=>a-b,
    '*' : (a, b)=>a*b,
    '/' : (a, b)=>a/b,
    '%' : (a, b)=>a%b,
    '>=' : (a, b)=>a>=b,
    '<=' : (a, b)=>a<=b,
    '>' : (a, b)=>a>b,
    '<' : (a, b)=>a<b,
    '!=' : (a, b)=>a!=b,
    '==' : (a, b)=>a==b,
    '&&' : (a, b)=>a&&b,
    '||' : (a, b)=>a||b,
    '[]' : (a, b)=>a[b],
}
const HOOK_NAMES = {
    '+' : 'add',
    '-' : 'subtract',
    '*' : 'multiply',
    '/' : 'divide',
    '%' : 'modulo',
    '>=' : 'greaterOrEqual',
    '<=' : 'lessOrEqual',
    '>' : 'greater',
    '<' : 'less',
    '!=' : 'notEqual',
    '==' : 'equal',
    '&&' : 'logicalAnd',
    '||' : 'logicalOr',
    '.' : 'access',
    '[]' : 'indexor',
    '()' : 'call',
    'TOSTRING' : 'toString'
}

export class ExpressionEvaluator {
    #vars;
    #builtInVars;
    #expressionEventHooks;
    
    constructor({expressionEventHooks, vars, builtInVars}) {
        this.#expressionEventHooks = expressionEventHooks;
        this.#vars = vars;
        this.#builtInVars = builtInVars;
    }

    evaluate(expression) {
        const result = this.#evaluateExpr(expression);

        if (this.#isLiteral(result)) {
            return result.value;
        }
        else {
            const hookName = HOOK_NAMES['TOSTRING'];
            const hook = this.#expressionEventHooks[hookName];
            if (hook) {
                return hook(result);
            }
            else {
                throw this.#error('No hook available to convert the expression to a string');
            }
        }
    }

    #evaluateExpr(expr):BaseExpression {
        switch(expr.type) {
            case ExpressionType.CALL:
                return this.#evaluateCallExpr(expr);
            case ExpressionType.IDENTIFIER:
                return this.#evaluateIdentifier(expr);
            case ExpressionType.PARAM:
                return this.#evaluateParamExpr(expr);
            default:
                return expr;
        }
    }
    
    #evaluateIdentifier(expr):ObjectExpression|LiteralExpression {
        if (!this.#isIdentifier(expr)) throw this.#error('Logic Error (evaluateIdentifier)')
        const identifier = expr.value;

        let data;
        if (identifier.at(0) === ':') {
            const sliced = identifier.slice(1);
            if (sliced in this.#builtInVars) {
                data = this.#vars[sliced];
            }
            else {
                throw this.#error(`Invalid keyword : ${identifier}`);
            }
        }
        else {
            if (identifier in this.#vars) {
                data = this.#vars[identifier];
            }
            else {
                throw this.#error(`Variable is not defined : ${identifier}`);
            }
        }
        switch(typeof data) {
            case 'string':
            case 'number':
            case 'boolean':
                return SyntaxToken.literal(data);
            case 'object':
                return SyntaxToken.object(data);
            default:
                throw this.#error(`Invalid variable type : ${identifier} (${typeof data})`)
        }
    }

    #evaluateCallExpr(expr):ObjectExpression|LiteralExpression {
        if (!this.#isCall(expr)) throw this.#error('Logic Error (evaluateCallExpr)');
        const operator = expr.value;
        const operand1 = this.#evaluateExpr(expr.operands[0]);
        const operand2 = this.#evaluateExpr(expr.operands[1]);
        
        // 문자열, 숫자의 경우 외부 hook를 사용하지 않음
        if (this.#isLiteral(operand1) && this.#isLiteral(operand2)) {
            if (operator in LITERAL_ACTIONS) {
                const caller = LITERAL_ACTIONS[operator]
                const result = caller(operand1.value, operand2.value);
                return SyntaxToken.literal(result);
            }
            else {
                throw this.#error(`Operation '${operator}' between literal values is not supported.`);
            }
        }
        else {
            if (operator in HOOK_NAMES) {
                const hookName = HOOK_NAMES[operator]
                const hook = this.#expressionEventHooks[hookName];
                
                if (hook == null) {
                    throw this.#error(`Hook not found '${operator}' (${hookName})`)
                }

                let result;
                if (operator === '()') {
                    if (!this.#isParam(operand2)) {
                        throw this.#error(`Unexpected Expression (no param)`)
                    }
                    result = hook(operand1, operand2.args);
                }
                else {
                    result = hook(operand1, operand2);
                }

                if (typeof result === 'number' || typeof result === 'string') {
                    return SyntaxToken.literal(result);
                }
                else {
                    return SyntaxToken.object(result);
                }
            }
            else {
                throw this.#error(`Invalid Operator '${operator}'`);
            }
        }
    }

    #evaluateParamExpr(expr):ParamExpression {
        if (!this.#isParam(expr)) throw this.#error('Logic Error (evaluateParamExpr)');

        const args:any[] = [];
        for(const child of expr.args) {
            args.push(this.#evaluateExpr(child));
        }
        return {
            type : ExpressionType.PARAM,
            args : args
        }
    }

    #isLiteral(expr):expr is LiteralExpression {
        return expr.type === ExpressionType.LITERAL;
    }
    #isCall(expr):expr is CallExpression {
        return expr.type === ExpressionType.CALL;
    }
    #isIdentifier(expr):expr is IdentifierExpression {
        return expr.type === ExpressionType.IDENTIFIER;
    }
    #isParam(expr):expr is ParamExpression {
        return expr.type === ExpressionType.PARAM;
    }

    #error(message) {
        return new Error(`Evaluation Failed : ${message}`)
    }
}
