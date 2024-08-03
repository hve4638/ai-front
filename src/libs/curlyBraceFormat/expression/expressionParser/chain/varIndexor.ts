import { VarStruct } from "../../../interface";


export class VarIndexor {
    #index;

    constructor(index:number) {
        this.#index = index;
    }

    build(varStruct:VarStruct) {
        let index = this.#index;
        if (index < 0) {
            index = varStruct.array.length + index;
        }

        return varStruct.array[index];
    }
}