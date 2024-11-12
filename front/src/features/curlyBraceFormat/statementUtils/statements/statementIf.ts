import { BranchError, BuildError } from '../errors'
import {
    Statement,
    StatementType,
    StatementElement,
    StatementElementHint
} from './interface'
import { StatementBuilder } from './statementBuilder'
import { Expression, Role } from './elements'
import { StatementError } from './errors';

interface Branch {
    condition:Expression;
    statementBuilder:StatementBuilder;
    hint:StatementElementHint|null;
}

export class StatementIf extends Statement {
    #branches:Branch[];
    #defaultBranchStatement:StatementBuilder|null;
    #defaultBranchStatementHint:StatementElementHint|null;

    constructor() {
        super();
        this.#branches = [];
        this.#defaultBranchStatement = null;
        this.#defaultBranchStatementHint = null;
    }

    override get statementType() {
        return StatementType.IF;
    }

    addBranch(expressionText:string, statementBuilder:StatementBuilder, hint?:StatementElementHint) {
        if (this.#defaultBranchStatement) {
            throw new BranchError('Cannot add a branch after the default branch has been set.');
        }
        
        this.#branches.push({
            condition : new Expression(expressionText),
            statementBuilder : statementBuilder,
            hint : hint ?? null
        });
    }
    
    addDefaultBranch(statementBuilder:StatementBuilder, hint?:StatementElementHint) {
        if (this.#defaultBranchStatement) {
            throw new BranchError('A default branch has already been set.');
        }

        this.#defaultBranchStatement = statementBuilder;
        this.#defaultBranchStatementHint = hint ?? null;
    }

    override build(buildArgs) {
        const evaluateBranch = (branch:Branch) => {
            try {
                const result = branch.condition.evaluate(buildArgs);

                if (typeof result !== 'number' && typeof result !== 'boolean') {
                    // @TODO : 적절한 에러 클래스 변경 필요
                    throw new BuildError(`Invalid type ${typeof result}`)
                }

                return Boolean(result);
            }
            catch(error:any) {
                throw new StatementError(error, branch.hint);
            }
        }
        const build = (statementBuilder:StatementBuilder)=> {
            const result:any[] = [];
            for (const element of statementBuilder) {
                if (element instanceof Role) {
                    // @TODO : 적절한 에러 클래스 변경 필요
                    throw new BuildError('Role is not premitted without top-level statement.');
                }
                else {
                    try {
                        result.push(element!.data.build(buildArgs));
                    }
                    catch (error:any) {
                        throw new StatementError(error, element!.hint);
                    }
                }
            }
            return result.join('');
        }

        for(const branch of this.#branches) {
            if (evaluateBranch(branch)) {
                return build(branch.statementBuilder)
            }
        }
        if (this.#defaultBranchStatement) {
            return build(this.#defaultBranchStatement)
        }
        
        return '';
    }
}