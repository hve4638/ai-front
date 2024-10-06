import { Constant, Expression, Role } from './elements'
import {
    Statement,
    StatementBuilderType,
    StatementElement,
    StatementElementHint
} from './interface'

export class StatementBuilder {
    #array:StatementElement[];
    #builderType:StatementBuilderType;

    constructor(builderType:StatementBuilderType) {
        this.#array = [];
        this.#builderType = builderType;
    }

    get builderType() {
        return this.#builderType;
    }
    
    addRole(role, hint?:StatementElementHint) {
        this.#array.push({
            data : new Role(role),
            hint
        });
    }

    addConstant(text, hint?:StatementElementHint) {
        this.#array.push({
            data : new Constant(text),
            hint
        });
    }

    addExpression(expression:string, hint?:StatementElementHint) {
        this.#array.push({
            data : new Expression(expression),
            hint,
        });
    }

    addStatement(statement:Statement, hint?:StatementElementHint) {
        this.#array.push({
            data : statement,
            hint,
        });
    }

    [Symbol.iterator]() {
        return {
            index: 0,
            array : this.#array,
            next() {
                if (this.index < this.array.length) {
                    return {
                        value : this.array[this.index++] as StatementElement,
                        done : false,
                    }
                }
                else {
                    return {
                        value : undefined,
                        done : true
                    }
                }
            }
        }
    }
}
