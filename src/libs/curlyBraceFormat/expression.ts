import { CurlyBraceFormatItem } from "./interface.ts";
import { Constant } from "./constant.ts"
import { Var } from "./var.ts";

export interface IExpression extends CurlyBraceFormatItem {
    build:(props:any)=>boolean;
}

const RE_EXPRESSION_DELEMITER = /(=)/;
const RE_EXPRESSION_STRING = /^("[^"]*"|'[^']*')$/
export class Expression implements IExpression {
    expression;

    constructor(expressionText:string) {
        this.expression = () => true;
        // 임시 구현
        // @TODO: 제대로 구현 필요
        const splitted = expressionText.split(RE_EXPRESSION_DELEMITER);
        if (splitted.length == 3 && splitted[1] == '=') {
            const left = this.#parseValueExpression(splitted[0].trim());
            const right = this.#parseValueExpression(splitted[2].trim());

            this.expression = (props) => {
                const expr1 = left.build(props);
                const expr2 = right.build(props);
                return expr1 == expr2;
            }
        }
        else {
            throw new Error("Implement Error : Expression");
        }
    }

    #parseValueExpression(item) {
        if (RE_EXPRESSION_STRING.exec(item)) {
            return new Constant(item.substring(1, item.length-1));
        }

        const num = Number(item);
        if (!isNaN(num)) {
            return new Constant(num);
        }

        return new Var(item);
    }

    build({ vars }) {
        return this.expression({ vars });
    }
}

export class AlwaysTrue implements IExpression {
    build(x?) {
        return true;
    }
}