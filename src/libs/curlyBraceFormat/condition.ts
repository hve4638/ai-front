import { CurlyBraceFormatItem } from './interface'
import { IExpression, AlwaysTrue } from './expression'

export class Condition implements CurlyBraceFormatItem {
    conditions:IExpression[];
    contents:CurlyBraceFormatItem[][] = []
    endOfCondition:boolean;

    constructor(expression:IExpression)  {
        this.conditions = [];
        this.contents = [];
        this.endOfCondition = false;

        this.addCondition(expression);
    }

    addItem(text:CurlyBraceFormatItem) {
        const lastcontents = this.contents.at(-1);
        lastcontents?.push(text);
    }

    addCondition(expression:IExpression) {
        if (this.endOfCondition) {
            throw new Error('Invalid syntax')
        }

        this.conditions.push(expression);
        this.contents.push([]);
    }

    addDefault() {
        if (this.endOfCondition) {
            throw new Error('Invalid syntax')
        }
        this.endOfCondition = true;

        this.conditions.push(new AlwaysTrue());
        this.contents.push([]);
    }

    build(props) {
        for (const index in this.conditions) {
            const expr = this.conditions[index];
            if (expr.build(props)) {
                let result = '';
                for (const item of this.contents[index]) {
                    result += item.build(props);
                }
                return result;
            }
        }

        return '';
    }
}
