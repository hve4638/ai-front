import { SyntaxTokenType } from "./syntaxToken";
import { ExpressionType, EvaluatableExpression, ParamExpression, LiteralExpression, IdentifierExpression, AnyExpression, CallExpression } from './expressionInterface'
import { ExpressionParseFailError } from "./error";

export class ExpressionParser {
    #tokens;
    #output:AnyExpression[];

    constructor(syntaxTokens) {
        this.#tokens = syntaxTokens;
        this.#output = [];
    }

    parse():EvaluatableExpression {
        this.#output = [];

        for(const token of this.#tokens) {
            if (token.type === SyntaxTokenType.OPERATOR) {
                if (token.value === '()') {
                    this.#parseCallOperator(token);
                }
                else {
                    this.#parseBinaryOperator(token);
                }
            }
            else {
                this.#output.push(token);
            }
        }

        if (this.#output.length === 1) {
            return this.#output[0] as EvaluatableExpression;
        }
        else if (this.#output.length === 0) {
            throw new ExpressionParseFailError('Invalid expression');
        }
        else {
            throw new ExpressionParseFailError('Unhandle token remaining');
        }
    }

    #parseBinaryOperator(token) {
        // [operand1, operand2, operator] 형태
        let operand2 = this.#output.pop() as AnyExpression;
        const operand1 = this.#output.pop() as EvaluatableExpression;
        
        if (operand1 == null || operand2 == null) {
            throw new ExpressionParseFailError(`Invalid operand '${token.value}'`);
        }
        if (token.value === '.') {
            // access 연산의 operand2는 토크나이저에서 IDENTIFIER로 분류하지만, 실제로는 문자열을 통해 엑세스하므로 LITERAL로 변환 필요
            if (this.#isIdentifierExpression(operand2)) {
                operand2 = {
                    type: ExpressionType.LITERAL,
                    value: operand2.value,
                } as LiteralExpression;
            }
            else {
                throw new ExpressionParseFailError(`Invalid operand '${token.value}' : Invalid accessor`);
            }
        }

        const operands = [operand1, operand2];
        this.#output.push(this.#getOperatorExpression(token.value, operands));
    }

    #parseCallOperator(token) {
        // [caller, [PARAM], param1, param2, ..., ()] 형태
        const args:EvaluatableExpression[] = [];
        
        while(this.#output.length > 0 && this.#output.at(-1)?.type !== SyntaxTokenType.PARAM) {
            args.unshift(this.#output.pop() as EvaluatableExpression);
        }

        if (this.#output.length == 0) {
            throw new ExpressionParseFailError(`Invalid CallExpression format`);
        }
        this.#output.pop(); // PARAM 토큰

        const caller = this.#output.pop() as EvaluatableExpression;
        this.#output.push(
            this.#getOperatorExpression(token.value,
                [
                    caller,
                    {
                        type : ExpressionType.PARAM,
                        args : args
                    } as ParamExpression
                ]
            )
        )
    }

    #getOperatorExpression(value:string, operands:AnyExpression[]):CallExpression {
        return {
            type: ExpressionType.CALL,
            value: value,
            operands : operands
        };
    }

    #isIdentifierExpression(expr:AnyExpression):expr is IdentifierExpression {
        return expr.type === 'IDENTIFIER';
    }
}