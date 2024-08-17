import { CurlyBraceFormatElement } from "./interface";

export class Role implements CurlyBraceFormatElement {
    #role:string;

    constructor(role:string) {
        this.#role = role;
    }

    build(args) {
        const {
            role = (x)=>x
        } = args;
        const r = role(this.#role);
        if (r) {
            return r;
        }
        else {
            throw new Error(`Parse Failed: Invalid Role (${this.#role})`);
        }
    }
}