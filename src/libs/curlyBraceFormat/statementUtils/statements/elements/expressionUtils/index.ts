import {
    ExpressionEvaluateFailError,
    IdentifierError,
    InvalidExpressionError,
    NoHookError,
    UnsupportedOperator
} from './error'

import {
    TokenizeFailError,
    SyntaxTransformFailError,
    ExpressionParseFailError,
} from './expressionParser'

export const CBFInternalErrors = {
    Tokenization : {
        TokenizeFailError,
    },
    Transformation : {
        SyntaxTransformFailError,
    },
    Parsing : {
        ExpressionParseFailError,
    },
    Evaluation : {
        ExpressionEvaluateFailError,
        IdentifierError,
        InvalidExpressionError,
        NoHookError,
        UnsupportedOperator,
    }
}

export {
    Tokenizer,
    SyntaxTransformer,
    ExpressionParser,
} from './expressionParser'

export {ExpressionEvaluator} from './expressionEvaluator'
export type {ExpressionArgs, Vars} from './interface'
