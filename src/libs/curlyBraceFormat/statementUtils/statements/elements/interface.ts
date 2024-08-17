import { ExpressionArgs } from './expressionUtils/interface';

export interface CurlyBraceFormatElement {
    build:(x:ExpressionArgs)=>string;
} 