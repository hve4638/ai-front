import { CurlyBraceFormatBuildArgs, CurlyBraceFormatItem } from "./interface";

export class ReversedVar implements CurlyBraceFormatItem {
    name: string;
    
    constructor(variable_name:string) {
        this.name = variable_name;
    }

    build(props:CurlyBraceFormatBuildArgs) {
        if (this.name in props.reversedVars) {
            return props.reversedVars[this.name];
        }
        else {
            return '';
        }
    }
}