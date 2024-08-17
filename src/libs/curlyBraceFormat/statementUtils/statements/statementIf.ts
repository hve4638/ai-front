import { BranchError } from '../errors'
import { Statement, StatementType } from './interface'
import { StatementBuilder } from './statementBuilder'
import { Expression, Role } from './elements'

interface Branch {
    condition:Expression;
    statementBuilder:StatementBuilder;
}

export class StatementIf extends Statement {
    #branches:Branch[];
    #defaultBranchStatement:StatementBuilder|null;

    constructor() {
        super();
        this.#branches = [];
        this.#defaultBranchStatement = null;
    }

    get statementType() {
        return StatementType.IF;
    }

    addBranch(expressionText:string, statementBuilder:StatementBuilder) {
        if (this.#defaultBranchStatement) {
            throw new BranchError('Cannot add a branch after the default branch has been set.');
        }
        
        this.#branches.push({
            condition : new Expression(expressionText),
            statementBuilder : statementBuilder
        });
    }
    
    addDefaultBranch(statementBuilder:StatementBuilder) {
        if (this.#defaultBranchStatement) {
            throw new BranchError('A default branch has already been set.');
        }

        this.#defaultBranchStatement = statementBuilder;
    }

    build(buildArgs) {
        const build = (statementBuilder:StatementBuilder)=> {
            const result:any[] = [];
            for (const element of statementBuilder) {
                if (element instanceof Role) {
                    throw new Error('Role is not premitted without top-level statement.');
                }
                else {
                    result.push(element.build(buildArgs));
                }
            }
            return result.join('');
        }

        for(const branch of this.#branches) {
            const result = branch.condition.evaluate(buildArgs);
            if (typeof result !== 'number' && typeof result !== 'boolean') {
                throw new Error(`Invalid type ${typeof result}`)
            }
            else if (Number(result)) {
                return build(branch.statementBuilder)
            }
        }

        if (this.#defaultBranchStatement) {
            return build(this.#defaultBranchStatement)
        }
        
        return '';
    }
}