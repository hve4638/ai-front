import { StatementForeach, StatementIf } from './statements';
import { Statement, StatementBuilderType, StatementType } from './statements/interface';
import { StatementBuilder } from './statements/statementBuilder';
import { BranchError, UnexpectedEndError } from './errors';

const RE_FOREACH_FIELD = /(\S+)\s+in\s+(\S+)/

export class PromptBuilder {
    #builderStack:StatementBuilder[];
    #statementStack:Statement[];

    constructor() {
        this.#builderStack = [];
        this.#statementStack = [];

    }

    #pushBuilder(statementBuilder:StatementBuilder) {
        this.#builderStack.push(statementBuilder);
    }

    #popBuilder() {
        this.#builderStack.pop();
    }

    #pushStatement(statement:Statement) {
        this.#statementStack.push(statement);
    }

    #popStatement(expectedType:StatementType) {
        const length = this.#statementStack.length;
        if (length === 0) {
            throw new Error('No statement found');
        }

        if (this.#statementStack[length-1].statementType !== expectedType) {
            throw new Error('Statement type mismatch')
        }
        
        this.#statementStack.pop();
    }

    #getBuilder():StatementBuilder {
        const length = this.#builderStack.length;
        if (length > 0) {
            return this.#builderStack[length-1];
        }
        else {
            throw new Error('No statement builder found');
        }
    }

    #getStatement(expectedType:StatementType):Statement {
        const length = this.#statementStack.length;
        if (length == 0) {
            throw new Error('No statement found');
        }
        
        const statement = this.#statementStack[length-1];
        if (statement.statementType !== expectedType) {
            throw new Error('Statement type mismatch')
        }

        return statement;
    }
    
    addRole(role:string) {
        const builder = this.#getBuilder();

        if (builder.builderType == StatementBuilderType.ROOT) {
            builder.addRole(role);
        }
        else {
            throw new Error('Role change are only permitted at the top-level block.')
        }
    }

    addConstant(text:string) {
        const builder = this.#getBuilder();

        builder.addConstant(text);
    }

    addExpression(expressionText:string) {
        const builder = this.#getBuilder();

        builder.addExpression(expressionText);
    }

    beginIf(expressionText:string) {
        const builder = this.#getBuilder();
        const statement = new StatementIf();
        const newBuilder = new StatementBuilder(StatementBuilderType.BRANCH);

        builder.addStatement(statement);
        statement.addBranch(expressionText, newBuilder);

        this.#pushStatement(statement);
        this.#pushBuilder(newBuilder);
    }

    beginElseIf(expression) {
        const statement = this.#getStatement(StatementType.IF) as StatementIf;
        const newBuilder = new StatementBuilder(StatementBuilderType.BRANCH);
        
        statement.addBranch(expression, newBuilder);

        this.#popBuilder();
        this.#pushBuilder(newBuilder);
    }

    beginElse() {
        const statement = this.#getStatement(StatementType.IF) as StatementIf;
        const newBuilder = new StatementBuilder(StatementBuilderType.BRANCH);
        
        statement.addDefaultBranch(newBuilder);

        this.#popBuilder();
        this.#pushBuilder(newBuilder);
    }

    endIf() {
        this.#popBuilder();
        this.#popStatement(StatementType.IF);
    }

    beginForeach(field) {
        const group = field.match(RE_FOREACH_FIELD);
        if (group == null) {
            throw new Error('Error')
        }
        const element = group[1];
        const iteratable = group[2];

        const builder = this.#getBuilder();
        const newBuilder = new StatementBuilder(StatementBuilderType.LOOP);
        const statement = new StatementForeach(element, iteratable, newBuilder);

        builder.addStatement(statement);

        this.#pushStatement(statement);
        this.#pushBuilder(newBuilder);
    }

    endForeach() {
        this.#popBuilder();
        this.#popStatement(StatementType.FOREACH);
    }

    beginBuild() {
        if (this.#builderStack.length > 0) {
            throw new Error('');
        }
        this.#builderStack.push(new StatementBuilder(StatementBuilderType.ROOT));
    }

    endBuild() {
        if (this.#builderStack.length === 1) {
            return;
        }
        else {
            throw new UnexpectedEndError('Unexpected End of Prompt');
        }
    }

    elements() {
        if (this.#builderStack.length !== 1) {
            return {
                [Symbol.iterator] : () => {
                    return {
                        next() {
                            return {
                                value : undefined,
                                done : false,
                            }
                        }
                    };
                }
            }
        }

        const iterator = {
            iteratorStack : [ this.#builderStack[0][Symbol.iterator]() ],
            next() {
                const length = this.iteratorStack.length;
                if (length === 0) {
                    return {
                        value : undefined,
                        done : true,
                    }
                }
                const iter = this.iteratorStack[length-1];
                const current = iter.next();

                if (current.done) {
                    this.iteratorStack.pop();
                    return this.next();
                }
                /*
                else if (current.value instanceof Statement) {
                    const newIter = current.value.exec(buildArgs);//[Symbol.iterator]();
                    this.iteratorStack.push(newIter);

                    return this.next();
                }/* */
                else {
                    return current;
                }
            }
        }

        return {
            [Symbol.iterator] : ()=>{
                return iterator;
            }
        }
    }
}
