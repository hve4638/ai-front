import { Expression, ExpressionArgs, Role } from './elements';
import { Statement, StatementType } from './interface';
import { StatementBuilder } from './statementBuilder';

export class StatementForeach extends Statement {
    #element:string;
    #iteratable:string;
    #statementBuilder:StatementBuilder;

    constructor(element:string, iteratable:string, statementBuilder:StatementBuilder) {
        super();
        this.#element = element;
        this.#iteratable = iteratable;
        this.#statementBuilder = statementBuilder;
    }

    get statementType(): StatementType {
        return StatementType.FOREACH;
    }
    
    build(args:ExpressionArgs) {
        const build = (statementBuilder:StatementBuilder, args:ExpressionArgs)=> {
            const result:any[] = [];
            for (const element of statementBuilder) {
                if (element instanceof Role) {
                    throw new Error("Role is not premitted without top-level statement.");
                }
                else {
                    result.push(element!.data.build(args));
                }
            }
            return result.join('');
        }

        const newArgs = {
            ...args,
            currentScope : {
                ...args.currentScope,
                [this.#element] : null,
            }
        };

        const iteratable = new Expression(this.#iteratable);
        
        let result = [] as string[];
        for (const item of iteratable.iterate(args)) {
            newArgs.currentScope[this.#element] = item;
            result.push(build(this.#statementBuilder, newArgs));
        }
        
        return result.join('');
    };
}