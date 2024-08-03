import { SyntaxTokenType } from "./syntaxToken";
import { ExpressionType, BaseExpression, ParamExpression, LiteralExpression, IdentifierExpression } from './expressionInterface'

export class ExpressionParser {
    #tokens;
    #output:BaseExpression[];

    constructor(syntaxTokens) {
        this.#tokens = syntaxTokens;
        this.#output = [];
    }

    parse() {
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
            return this.#output[0];
        }
        else if (this.#output.length === 1) {
            throw this.#error('Empty');
        }
        else {
            throw this.#error('Unhandle token remaining');
        }
    }

    #parseBinaryOperator(token) {
        // [operand1, operand2, operator] 형태
        let operand2 = this.#output.pop() as BaseExpression;
        const operand1 = this.#output.pop() as BaseExpression;
        
        if (operand1 == null || operand2 == null) {
            throw this.#error(`Invalid operand (${token.value})`);
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
                throw this.#error(`Invalid operand (${token.value}) - Invalid accessor`)
            }
        }

        const operands = [operand1, operand2];
        this.#output.push(this.#getOperatorExpression(token.value, operands));
    }

    #parseCallOperator(token) {
        // [caller, [PARAM], param1, param2, ..., ()] 형태
        const args:BaseExpression[] = [];
        
        while(this.#output.length > 0 && this.#output.at(-1)?.type !== SyntaxTokenType.PARAM) {
            args.unshift(this.#output.pop() as BaseExpression);
        }

        if (this.#output.length == 0) {
            throw this.#error('Invalid CallExpression format');
        }
        this.#output.pop(); // PARAM 토큰

        const caller = this.#output.pop() as BaseExpression;
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

    #getOperatorExpression(value:string, operands:BaseExpression[]) {
        return {
            type: ExpressionType.CALL,
            value: value,
            operands : operands
        };
    }

    #isIdentifierExpression(expr:BaseExpression):expr is IdentifierExpression {
        return expr.type === 'IDENTIFIER';
    }

    #error(message, reason='') {
        if (reason.length > 0) {
            return new Error(`Expression Parse Failed : ${message}\n${reason}`)
        }
        else {
            return new Error(`Expression Parse Failed : ${message}\n${JSON.stringify(this.#tokens)}`)
        }
    }
}