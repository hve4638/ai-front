import { CurlyBraceFormatItem } from './interface'

export class Constant implements CurlyBraceFormatItem {
    value:any;
    constructor(value) {
        this.value = value;
    }

    build(x?) {
        return this.value;
    }
}