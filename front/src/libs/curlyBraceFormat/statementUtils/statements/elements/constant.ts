import { CurlyBraceFormatElement } from './interface'

export class Constant implements CurlyBraceFormatElement {
    value:any;
    constructor(value) {
        this.value = value;
    }

    build(x?) {
        return this.value;
    }
}