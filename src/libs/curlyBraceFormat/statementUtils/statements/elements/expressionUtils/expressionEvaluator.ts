import { ExpressionArgs, ExpressionEventHooks, OPERATOR_HOOKS, Vars } from './interface';
import { SyntaxToken, ExpressionType, EvaluatableExpression, IdentifierExpression, LiteralExpression, ObjectExpression, CallExpression, ParamExpression } from './expressionParser';
import { AnyExpression } from './expressionParser/expressionInterface';
import { IdentifierError, InvalidExpressionError, NoHookError, UnsupportedOperator } from './error';
import { LogicError } from 'features/errors';

const LITERAL_ACTIONS = {
    add(a, b) { return a + b },
    substract(a, b) { return a - b },
    multiply(a, b) { return a * b },
    divide(a, b) { return a / b },
    module(a, b) { return a % b },
    greaterOrEqual(a, b) { return a >= b },
    lessOrEqual(a, b) { return a <= b },
    greater(a, b) { return a > b },
    less(a, b) { return a < b },
    notEqual(a, b) { return a != b },
    equal(a, b) { return a == b },
    logicalAnd(a, b) { return a && b },
    logicalOr(a, b) { return a || b },
    indexor(a, b) { return a[b] },
    stringify(literal:number|string) { return literal.toString() }
} as const;

export class ExpressionEvaluator {
    #vars:Vars;
    #builtInVars:Vars;
    #currentScope:Vars;
    #expressionEventHooks:Partial<ExpressionEventHooks>;
    
    constructor(args:ExpressionArgs) {
        const {expressionEventHooks, vars, builtInVars, currentScope} = args;
        this.#expressionEventHooks = expressionEventHooks ?? {};
        this.#vars = vars ?? {};
        this.#currentScope = currentScope ?? {};
        this.#builtInVars = builtInVars ?? {};
    }

    evaluateAndStringify(expression:EvaluatableExpression) {
        const result = this.#evaluateExpr(expression) as EvaluatableExpression;

        if (this.#isLiteral(result)) {
            return result.value.toString();
        }
        else {
            const hookName = OPERATOR_HOOKS['STRINGIFY'];
            const hook = this.#expressionEventHooks[hookName];
            if (hook) {
                return hook(result).toString();
            }
            else {
                throw new NoHookError(hookName, result);
            }
        }
    }

    evaluate(expression:EvaluatableExpression) {
        const result = this.#evaluateExpr(expression);

        if (this.#isLiteral(result)) {
            return result.value;
        }
        else {
            return result;
        }
    }

    evaluateAndIterate(expression:EvaluatableExpression) {
        const expr = this.#evaluateExpr(expression) as EvaluatableExpression;
        const hookName = OPERATOR_HOOKS['ITERATE'];

        if (this.#isLiteral(expr)) {
            throw new UnsupportedOperator('iterate', expr);
        }
        else {
            const hook = this.#expressionEventHooks[hookName];
            if (hook) {
                return hook(expr);
            }
            else {
                throw new NoHookError(hookName, expr);
            }
        }
    }

    #evaluateExpr(expr):AnyExpression {
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
        if (!this.#isIdentifier(expr)) throw new LogicError();
        const identifier = expr.value;

        let data;
        if (identifier.at(0) === ':') {
            const sliced = identifier.slice(1);
            if (sliced in this.#builtInVars) {
                data = this.#builtInVars[sliced];
            }
            else {
                throw new IdentifierError('Invalid built-in variable', expr);
            }
        }
        else {
            if (identifier in this.#currentScope) {
                data = this.#currentScope[identifier];
            }
            else if (identifier in this.#vars) {
                data = this.#vars[identifier];
            }
            else {
                throw new IdentifierError('Variable is not defined', expr);
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
                throw new IdentifierError(`Invalid variable type '${typeof data}'`, expr);
        }
    }

    #evaluateCallExpr(expr):ObjectExpression|LiteralExpression {
        if (!this.#isCall(expr)) throw new LogicError();
        const operator = expr.value;
        const operand1 = this.#evaluateExpr(expr.operands[0]);
        const operand2 = this.#evaluateExpr(expr.operands[1]);
        
        const hookName = OPERATOR_HOOKS[operator]
        
        // 리터럴끼리의 연산은 외부 hook를 사용하지 않음
        if (this.#isLiteral(operand1) && this.#isLiteral(operand2)) {
            if (hookName in LITERAL_ACTIONS) {
                const caller = LITERAL_ACTIONS[hookName];
                const result = caller(operand1.value, operand2.value);

                return SyntaxToken.literal(result);
            }
            else {
                throw new UnsupportedOperator(operator, expr);
            }
        }
        else {
            if (operator in OPERATOR_HOOKS) {
                const hookName = OPERATOR_HOOKS[operator]
                const hook = this.#expressionEventHooks[hookName];
                
                if (hook == null) {
                    throw new NoHookError(hookName, expr);
                }

                let result;
                if (operator === '()') {
                    if (!this.#isParam(operand2)) {
                        throw new InvalidExpressionError('No ParamExpression found', expr);
                    }
                    result = hook(operand1, operand2.args);
                }
                else {
                    result = hook(operand1, operand2);
                }

                if (typeof result === 'number' || typeof result === 'string' || typeof result === 'boolean') {
                    return SyntaxToken.literal(result);
                }
                else {
                    return SyntaxToken.object(result);
                }
            }
            else {
                throw new InvalidExpressionError('Invalid Operator', expr);
            }
        }
    }

    #evaluateParamExpr(expr):ParamExpression {
        if (!this.#isParam(expr)) throw new LogicError();

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
