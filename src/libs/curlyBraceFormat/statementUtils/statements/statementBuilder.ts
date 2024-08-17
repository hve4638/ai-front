import { Constant, Expression, Role } from './elements'
import { Statement, StatementBuilderType } from './interface'

export class StatementBuilder {
    #array;
    #builderType:StatementBuilderType;

    constructor(builderType:StatementBuilderType) {
        this.#array = [];
        this.#builderType = builderType;
    }

    get builderType() {
        return this.#builderType;
    }
    
    addRole(role) {
        this.#array.push(new Role(role));
    }

    addConstant(text) {
        this.#array.push(new Constant(text));
    }

    addExpression(expression:string) {
        this.#array.push(new Expression(expression));
    }

    addStatement(statement:Statement) {
        this.#array.push(statement);
    }

    [Symbol.iterator]() {
        return {
            index: 0,
            array : this.#array,
            next() {
                if (this.index < this.array.length) {
                    return {
                        value : this.array[this.index++],
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
