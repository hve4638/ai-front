import { VarStruct } from '../../../interface';

export class VarFunction {
    #funcname:string;
    #funcargs:any[];

    constructor(name:string, args:any[]) {
        this.#funcname = name;
        this.#funcargs = args;
    }

    build(varStruct:VarStruct) {
        const caller = varStruct.functions[this.#funcname];

        return caller.apply(varStruct, this.#funcargs);
    }
}