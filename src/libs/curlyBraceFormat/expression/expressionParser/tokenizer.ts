const TOKEN_TYPES = {
    NUMBER: /\d+(\.\d+)?/,
    STRING: /(["'])(?:(?=(\\?))\2.)*?\1/,
    OPERATOR: /(\+|-|\*|\/|%|==|<=|>=|<|>|&&|\|\||\.)/,
    IDENTIFIER: /\:?[a-zA-Z_]\w*/,
    PAREN : /(\(|\))/,
    SPACE: /\s+/,
    INDEXOR : /(\[|\])/,
    DELIMITER : /\,/,
};

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
            for (const [tokenType, pattern] of Object.entries(TOKEN_TYPES)) {
                const regex = new RegExp(`^${pattern.source}`);
                match = part.match(regex);
                
                if (match) {
                    if (tokenType === 'SPACE') {
                        // nothing to do
                    }
                    else {
                        tokens.push({ type: tokenType, value: match[0] });
                    }

                    position += match[0].length;
                    break;
                }
            }
            
            if (!match) {
                let text = '';
                text += `Tokenize Failed : Unexpected Character (${this.#expression[position]})\n`
                text += `    ${this.#expression}\n`
                text += `    ${' '.repeat(position)}^`
                throw new Error(text);
            }
        }

        return tokens;
    }
}