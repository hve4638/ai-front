import { CurlyBraceFormatElement } from './interface'
import { Tokenizer, SyntaxTransformer, ExpressionParser, ExpressionEvaluator } from './expressionUtils';
import { ExpressionArgs } from './expressionUtils/interface';


export class Expression implements CurlyBraceFormatElement {
    #expressionText;
    #expression;
    
    constructor(expressionText:string) {
        this.#expressionText = expressionText;
        const tokenizer = new Tokenizer(this.#expressionText);
        const transformer = new SyntaxTransformer(tokenizer.tokenize());
        const expressionParser = new ExpressionParser(transformer.transform());
        this.#expression = expressionParser.parse();
    }

    get raw() {
        return this.#expressionText;
    }

    build(exprArgs:ExpressionArgs) {
        const evaluator = new ExpressionEvaluator(exprArgs);
        
        return evaluator.evaluateAndStringify(this.#expression);
    }

    iterate(buildArgs) {
        const evaluator = new ExpressionEvaluator(buildArgs);
        
        return evaluator.evaluateAndIterate(this.#expression);
    }

    evaluate(exprArgs:ExpressionArgs) {
        const evaluator = new ExpressionEvaluator(exprArgs);
        
        return evaluator.evaluate(this.#expression);
    }
}