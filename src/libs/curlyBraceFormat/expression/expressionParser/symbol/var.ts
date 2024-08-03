import { CurlyBraceFormatBuildArgs, CurlyBraceFormatItem, VarStruct } from '../../../interface'

export class Var implements CurlyBraceFormatItem {
    name: string;
    
    constructor(variable_name:string) {
        this.name = variable_name;
    }

    indexor(props:CurlyBraceFormatBuildArgs, {index}:{index:number}) {
        const value = this.build(props);
        if (value == null) {
            console.error(`CurlyBraceFormat Error (Var#indexor)`);
            return '';
        }
        else {
            try {
                return value.array[index];
            }
            catch(err) {
                console.error(`CurlyBraceFormat Error (Var#indexor) : ${err}`);
                return '';
            }
        }
    }
    
    field(props:CurlyBraceFormatBuildArgs, {name}:{name:string}) {
        const value = this.build(props);
        if (value == null) {
            return '';
        }
        else {
            try {
                return value.fields[name] ?? '';
            }
            catch(err) {
                console.error(`CurlyBraceFormat Error (Var#field) : ${err}`);
                return '';
            }
        }
    }

    call(props:CurlyBraceFormatBuildArgs, {name, args}:{name:string, args:any[]}) {
        const value = this.build(props);
        if (value == null) {
            return '';
        }
        else {
            try {
                const caller = value.functions[name];
                return caller.apply(value, [args]);
            }
            catch(err) {
                console.error(`CurlyBraceFormat Error (Var#call) : ${err}`);
                return '';
            }
        }
    }

    value(args:CurlyBraceFormatBuildArgs) {
        return this.build(args) ?? '';
    }

    build(args:CurlyBraceFormatBuildArgs) {
        return args.vars[this.name];
    }
}

export class ReservedVar implements CurlyBraceFormatItem {
    name: string;
    
    constructor(variable_name:string) {
        this.name = variable_name;
    }

    build(props:CurlyBraceFormatBuildArgs):VarStruct|string {
        if (this.name in props.reservedVars) {
            return props.reservedVars[this.name];
        }
        else {
            return '';
        }
    }
}