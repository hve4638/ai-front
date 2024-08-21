import { TokenizeFailError } from "./error";

const TOKEN_TYPES = {
    NUMBER: /\d+(\.\d+)?/,
    STRING: /(["'])(?:(?=(\\?))\2.)*?\1/,
    OPERATOR: /(\+|-|\*|\/|%|==|=|<=|>=|<|>|&&|\|\||\.)/,
    IDENTIFIER: /\:?[a-zA-Z_]\w*/,
    PAREN : /(\(|\))/,
    SPACE: /\s+/,
    INDEXOR : /(\[|\])/,
    DELIMITER : /\,/,
};

const INVALID_TOKEN_PATTERNS = {
    IDENTIFIER : /\:?\d+(?:\.\d+)?[a-zA-Z_]\w*/
}

export class Tokenizer {
    #expression:string;

    constructor(expression) {
        this.#expression = expression;
    }

    tokenize() {
        const tokens:{type:string,value:string}[] = [];
        let position = 0;
        
        while (position < this.#expression.length) {
            let match:RegExpMatchArray|null = null;
            
            const part = this.#expression.slice(position);
            for (const [tokenType, pattern] of Object.entries(INVALID_TOKEN_PATTERNS)) {
                const regex = new RegExp(`^${pattern.source}`);
                match = part.match(regex);

                if (match) {
                    throw new TokenizeFailError(
                        'Invalid token',
                        {
                            expressionText : this.#expression,
                            position : position
                        }
                    );
                }
            }

            for (const [tokenType, pattern] of Object.entries(TOKEN_TYPES)) {
                const regex = new RegExp(`^${pattern.source}`);
                match = part.match(regex);
                
                if (match) {
                    if (tokenType === 'SPACE') {
                        // nothing to do
                    }
                    else if (match[0] === '=') {
                        // 이전 버전 문법 호환
                        // 추후 제거 예정
                        tokens.push({ type: tokenType, value: '==' });
                    }
                    else {
                        tokens.push({ type: tokenType, value: match[0] });
                    }

                    position += match[0].length;
                    break;
                }
            }
            
            if (!match) {
                throw new TokenizeFailError(
                    'Invalid token',
                    {
                        expressionText : this.#expression,
                        position : position
                    }
                );
            }
        }

        return tokens;
    }
}