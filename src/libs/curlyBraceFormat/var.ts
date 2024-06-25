import { CurlyBraceFormatBuildArgs, CurlyBraceFormatItem } from "./interface";

export class Var implements CurlyBraceFormatItem {
    name: string;
    
    constructor(variable_name:string) {
        this.name = variable_name;
    }

    build(props:CurlyBraceFormatBuildArgs) {
        if (this.name in props.vars) {
            return props.vars[this.name];
        }
        else {
            return '';
        }
    }
}