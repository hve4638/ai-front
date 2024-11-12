import { SyntaxTransformFailError } from './error';
import { SyntaxToken } from './syntaxToken';

type Token = {
    type : string;
    value : string;
}

enum ParenType {
    FUNCTION,
    EXPRESSION,
}
const HIGHEST_PRECEDENCE = 10;
const EXCEPT_PRECEDENCE = 'NOPRECEDENCE';
const OPERATOR_PRECEDENCE = {
    '.' : HIGHEST_PRECEDENCE,
    '()' : HIGHEST_PRECEDENCE,
    '[]' : HIGHEST_PRECEDENCE,
    '*' : 6, '/' : 6, '%' : 6,
    '+' : 5, '-' : 5,
    '<=' : 4, '>=' : 4, '<' : 4, '>' : 4,
    '==' : 3, '!=' : 3,
    '&&' : 2,
    '||' : 1,
    ',' : 0,
    
    '[' : EXCEPT_PRECEDENCE,
    '(' : EXCEPT_PRECEDENCE,
} as const;

export class SyntaxTransformer {
    #tokens:Token[];

    constructor(tokens:any[]) {
        this.#tokens = tokens;
    }

    // Shunting Yard 알고리즘의 변형
    transform() {
        const stacks = new SyntaxTokenStacks(this.#tokens);

        // ()이 함수 호출인지, 우선순위 처리인지 확인
        let isLastTokenExpression = false;

        for (const token of this.#tokens) {
            switch(token.type) {
            case 'NUMBER':
                stacks.add(SyntaxToken.number(token.value));
                isLastTokenExpression = true;
                break;
            case 'STRING':
                stacks.add(SyntaxToken.string(token.value));
                isLastTokenExpression = true;
                break;
            case 'IDENTIFIER':
                stacks.add(SyntaxToken.identifier(token.value));
                isLastTokenExpression = true;
                break;
            case 'INDEXOR':
                if (token.value === '[') {
                    stacks.addOperator('[');
                }
                else if (token.value === ']') {
                    stacks.moveOperatorUntilChar('[');
                    stacks.add(SyntaxToken.operator('[]'));
                }
                isLastTokenExpression = false;
                break;
            case 'OPERATOR':
                stacks.addOperator(token.value);
                isLastTokenExpression = false;
                break;
            case 'DELIMITER':
                // ',' 는 함수 인자 구분자로만 사용
                if (stacks.lastParenType !== ParenType.FUNCTION) {
                    throw new SyntaxTransformFailError('Multiple value in a single expression are not allowed', { tokens: this.#tokens, token: token });
                }
                break;
            case 'PAREN':
                if (token.value === '(') {
                    if (isLastTokenExpression) {
                        stacks.addOpenParen(ParenType.FUNCTION);
                    }
                    else {
                        stacks.addOpenParen(ParenType.EXPRESSION);
                    }
                }
                else if (token.value === ')') {
                    stacks.addCloseParen();
                }
                isLastTokenExpression = false;
                break;
            default:
                throw new SyntaxTransformFailError(`Invalid Token`, { tokens: this.#tokens, token });
            }
        }

        stacks.moveOperatorAll();
        return stacks.result;
    }
}


class SyntaxTokenStacks {
    #tokens:Token[];
    #result:any[] = [];
    #operatorStack:string[] = [];
    #parenStack:ParenType[] = [];

    constructor(tokens) {
        this.#tokens = tokens;
    }

    get result() {
        return this.#result;
    }

    get lastParenType() {
        return this.#parenStack.at(-1);
    }

    add(token) {
        this.#result.push(token);
    }

    addOperator(operator, noPrecedenceCheck=false) {
        if (!noPrecedenceCheck && OPERATOR_PRECEDENCE[operator] !== EXCEPT_PRECEDENCE) {
            this.moveOperatorUntilLowerPrecedence(operator);
        }
        this.#operatorStack.push(operator);
    }

    addOpenParen(parenType:ParenType) {
        this.#parenStack.push(parenType);
        if (parenType === ParenType.EXPRESSION) {
            this.addOperator('(', true);
        }
        else if (parenType === ParenType.FUNCTION) {
            this.moveOperatorUntilLowerPrecedence(HIGHEST_PRECEDENCE);
            this.add(SyntaxToken.param());
            this.addOperator('(', true);
        }
        else {
            throw new Error('Logic Error (SyntaxTokenStacks.addOpenParen)')
        }
    }
    addCloseParen() {
        const parenType = this.#parenStack.pop();
        if (parenType === ParenType.EXPRESSION) {
            this.moveOperatorUntilChar('(');
        }
        else if (parenType === ParenType.FUNCTION) {
            this.moveOperatorUntilChar('(');
            this.addOperator('()');
            this.#moveOperator();
        }
        else {
            throw new Error('Invalid Expression Format')
        }
    }

    moveOperatorUntilLowerPrecedence(target:string|number) {
        let targetPrecedence = 0;
        
        if (typeof target === 'string') {
            targetPrecedence = OPERATOR_PRECEDENCE[target];    
        }
        else {
            targetPrecedence = target;
        }
        
        while (
            !this.#isOperatorStackEmpty()
            && OPERATOR_PRECEDENCE[this.#topOperatorStack()] !== EXCEPT_PRECEDENCE
            && OPERATOR_PRECEDENCE[this.#topOperatorStack()] >= targetPrecedence) {
            this.#moveOperator();
        }
    }

    moveOperatorAll() {
        while (!this.#isOperatorStackEmpty()) {
            this.#moveOperator();
        }
    }

    // 특정 operator를 찾을 때까지 operatorStack -> resultStack으로 이동
    // 이후 특정 operator는 버려짐
    moveOperatorUntilChar(op) {
        while (!this.#isOperatorStackEmpty() && this.#topOperatorStack() !== op) {
            this.#moveOperator();
        }

        if (this.#isOperatorStackEmpty()) {
            // char를 찾지 못한 경우
            throw new SyntaxTransformFailError(`Token '${op}' not found`, { tokens: this.#tokens });
        }
        else {
            this.#popOperatorStack();
        }
    }

    #moveOperator() {
        this.add(SyntaxToken.operator(this.#popOperatorStack()));
    }

    #isOperatorStackEmpty() {
        return this.#operatorStack.length == 0;
    }

    #topOperatorStack() {
        return this.#operatorStack[this.#operatorStack.length-1];
    }

    #popOperatorStack() {
        return this.#operatorStack.pop() as string;
    }
}