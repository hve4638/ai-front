import { CurlyBraceFormatBuildArgs, CurlyBraceFormatItem, VarStruct } from '../../../interface';
import { Var } from './var'

export class Constant extends Var {
    varStruct: VarStruct;
    
    constructor(varStruct:VarStruct) {
        super('');
        this.varStruct = varStruct;
    }

    build(args:CurlyBraceFormatBuildArgs) {
        return this.varStruct;
    }
}