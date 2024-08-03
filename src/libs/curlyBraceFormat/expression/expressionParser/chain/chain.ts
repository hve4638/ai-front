import { CurlyBraceFormatBuildArgs, VarStruct } from "../../../interface";

export class Chain {
    #target:any;
    #list:any[];

    constructor(target) {
        this.#target = target;
        this.#list = [];
    }

    add(data) {
        this.#list.push(data);
    }

    build(props:CurlyBraceFormatBuildArgs):string {
        let last = this.#target.build(props);
        
        for (const item of this.#list) {
            last = item.build(last);
        }
        if (typeof last === 'object') {
            last = last.value;
        }

        return last;
    }
}