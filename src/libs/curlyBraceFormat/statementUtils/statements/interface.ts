import { Constant, Expression, Role } from "./elements";

export class Statement {
    get statementType():StatementType {
        throw StatementType.NONE;
    }
    build(buildArgs) {
        throw new Error('Not Implementation');
    };
}

export enum StatementBuilderType {
    ROOT,
    LOOP,
    BRANCH
}

export enum StatementType {
    FOREACH,
    IF,
    NONE
}

export type StatementElementHint = {
    position:number,
    text:string
}

export type StatementElement = {
    data : Role | Constant | Expression | Statement;
    hint? : StatementElementHint
}