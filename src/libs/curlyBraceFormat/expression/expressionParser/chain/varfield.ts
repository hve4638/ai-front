import { VarStruct } from '../../../interface';

export class VarField {
    #fieldname;

    constructor(fieldname:string) {
        this.#fieldname = fieldname;
    }

    build(varStruct:VarStruct) {
        return varStruct.fields[this.#fieldname];
    }
}