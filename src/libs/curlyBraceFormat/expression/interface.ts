import { BaseExpression, ObjectExpression } from "./expressionParser";

interface ExpressionEventHooks {
    '+' : 'add',
    '-' : 'subtract',
    '*' : 'multiply',
    '/' : 'divide',
    '%' : 'modulo',
    '>=' : 'greaterOrEqual',
    '<=' : 'lessOrEqual',
    '>' : 'greater',
    '<' : 'less',
    '!=' : 'notEqual',
    '==' : 'equal',
    '&&' : 'logicalAnd',
    '||' : 'logicalOr',
    '.' : 'access',
    'indexor' : (obj:ObjectExpression, index:BaseExpression)=>void;
    'call' : (obj:ObjectExpression, args:BaseExpression[])=>void;
    'toString' : (obj:ObjectExpression)=>void;
}