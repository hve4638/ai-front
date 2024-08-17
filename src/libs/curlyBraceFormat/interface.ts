import { ExpressionArgs } from './statementUtils';

export type CurlyBraceFormatBuildArgs = {
    role? : (rawrole:string)=>string;
    map? : (text:string, role:string)=>any;
} & ExpressionArgs;
