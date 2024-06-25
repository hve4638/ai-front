import { CurlyBraceFormatBuildArgs, CurlyBraceFormatItem } from "./interface";

export class Role implements CurlyBraceFormatItem {
    #role:string;

    constructor(role:string) {
        this.#role = role;
        switch(role) {
            case 'user':
            case 'bot':
            case 'system':
                break;
            default:
                throw new Error(`Role must be user, bot or system. not '${role}'`);
        }
    }

    build(args:CurlyBraceFormatBuildArgs) {
        const {
            role = (x)=>x
        } = args
        return role(this.#role);
    }
}