import { CurlyBraceFormatItem } from '../interface';
import { Tokenizer, SyntaxTransformer, ExpressionParser, SyntaxTokenType } from './expressionParser';
import { ExpressionEvaluator } from './expressionEvaluator';

export interface IExpression extends CurlyBraceFormatItem {
    
}

export class Expression implements IExpression {
    #expressionText;
    #expression;
    
    constructor(expressionText:string) {
        this.#expressionText = expressionText;
        const tokenizer = new Tokenizer(this.#expressionText);
        const transformer = new SyntaxTransformer(tokenizer.tokenize());
        const expressionParser = new ExpressionParser(transformer.transform());
        this.#expression = expressionParser.parse();
    }

    evaluate({ vars, expressionEventHooks, builtInVars }) {
        const evaluator = new ExpressionEvaluator({ vars, expressionEventHooks, builtInVars });
        
        return evaluator.evaluate(this.#expression);
    }
}


export class AlwaysTrue implements IExpression {
    build(x?) {
        return true;
    }
}