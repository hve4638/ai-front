import { CurlyBraceFormatItem, CurlyBraceFormatBuildArgs } from "./interface.ts";
import { Var } from "./var.ts"
import { ReversedVar } from "./reversedVar.ts"
import { Expression } from "./expression.ts";
import { Condition } from "./condition.ts"
import { Role } from "./role.ts";
import { Constant } from "./constant.ts";

const RE_CURLY = /(\s*\{\{::[^\n{}]+?\}\}\s*|\{\{:?[^:\n{}]+?\}\})/ms

export class CurlyBraceFormatParser {
    parsed: (CurlyBraceFormatItem|Role)[];
    currentCondition:null|Condition;

    constructor(text:string) {
        this.parsed = [];
        this.currentCondition = null;

        let inCurly;
        const splitted = text.split(RE_CURLY);
        for (const item of splitted) {
            if (item === '') {
                // nothing
            }
            else if (!this.#isValidCurlyFormat(item)) {
                this.#addContents(new Constant(item));
            }
            // {{:keyword}} 포맷
            else if (inCurly = this.#tryParseSingleCommaCurlyFormat(item)) {
                this.#addContents(new ReversedVar(inCurly));
            }
            // {{::keyword [optional]}} 포맷
            else if (inCurly = this.#parseKeywordInCurlyFormat(item)) {
                const wsLeft = item.split('{{')[0];
                if (wsLeft.includes('\n')) {
                    this.#addContents(new Constant('\n'))
                }
                else if (wsLeft.includes(' ')) {
                    this.#addContents(new Constant(' '))
                }

                const [keyword, expression] = inCurly;
                switch (keyword) {
                case '::role':
                    this.#addContents(new Role(expression));
                    break;
                case '::if':
                    this.#addIf(expression);
                    break;
                case '::elif':
                case '::elseif':
                    this.#addElif(expression, {keyword});
                    break;
                case '::else':
                    this.#addElse();
                    break;
                case '::endif':
                    this.#addEndif();
                    break;
                default:
                    throw new Error(`Invalid keyword '${keyword}'`);
                }

                const wsRight = item.split('}}')[1];
                if (wsRight.includes('\n')) {
                    this.#addContents(new Constant('\n'))
                }
                else if (wsRight.includes(' ')) {
                    this.#addContents(new Constant(' '))
                }
            }
            // {{keyword}} 포맷
            else {
                const varname = this.#removeCurly(item)
                this.#addContents(new Var(varname));
            }
        }

        // {{::if }} 이후 {{::endif}}가 오지 않은 경우
        if (this.currentCondition) {
            throw new Error('{{::endif}} is missing')
        }
    }

    #addContents(item:CurlyBraceFormatItem) {
        if (this.currentCondition) {
            this.currentCondition.addItem(item);
        }
        else {
            this.parsed.push(item);
        }
    }

    #addIf(expressionText:string) {
        // @TODO: 중첩 if문 지원 필요
        if (this.currentCondition) {
            throw new Error("Nesting 'if' is not supported.")
        }
        const expression = new Expression(expressionText);
        this.currentCondition = new Condition(expression);
    }

    #addElif(expressionText:string, { keyword }) {
        if (!this.currentCondition) {
            throw new Error(`Unexpected keyword '${keyword}'`)
        }
        const expression = new Expression(expressionText);
        this.currentCondition.addCondition(expression);
    }

    #addElse() {
        if (!this.currentCondition) {
            throw new Error(`Unexpected keyword 'else'`)
        }
        this.currentCondition.addDefault();
    }

    #addEndif() {
        if (!this.currentCondition) {
            throw new Error(`Unexpected keyword 'endif'`)
        }
        this.parsed.push(this.currentCondition);
        this.currentCondition = null;
    }

    #isValidCurlyFormat(text:string):boolean {
        return RE_CURLY.exec(text) != undefined
    }

    #parseKeywordInCurlyFormat(textInCurly:string):null|[string,string|null] {
        const text = this.#removeCurly(textInCurly);
        if (!text.startsWith('::')) {
            return null;
        }
        else {
            const part = text.split(/\s+/);
            const symbol = part[0].toLowerCase();
            const remained = text.slice(part[0].length).trim();

            if (remained.length == 0) {
                return [symbol, null];
            }
            else {
                return [symbol, remained];
            }
        }
    }

    #tryParseSingleCommaCurlyFormat(textInCurly:string):null|string {
        const text = this.#removeCurly(textInCurly);
        if (!text.startsWith(':') || text.startsWith('::')) {
            return null;
        }
        else {
            const part = text.split(/\s+/);
            return part[0].slice(1);
        }
    }

    #removeCurly(curlyFormat) {
        const text = curlyFormat.trim();
        return text.substring(2, text.length-2)
    }

    build(props:CurlyBraceFormatBuildArgs) {
        const contents:{
            role:string,
            text:string
        }[] = [];
        let content:{
            role:string,
            text:string
        }|null = null;
        
        for (const item of this.parsed) {
            if (item instanceof Role) {
                content = {
                    role : item.build(props),
                    text : ''
                }
                contents.push(content);
            }
            else {
                if (content == null) {
                    content = {
                        role : 'user',
                        text : ''
                    }
                    contents.push(content);
                }
                content.text += item.build(props);
            }
        }

        const {
            map = (x)=>x
        } = props;
        const result:any = [];
        for (const content of contents) {
            //content.text = content.text.trim();
            result.push(map(content.text.trim(), content.role));
        }

        return result;
    }
}

class InterruptableIterator {
    target:any[]
    interrupted:any[]

    constructor(target:any[]) {
        this.target = target;
        this.interrupted = []
    }

    [Symbol.iterator]() {
        let index = 0;
        let interrupteIndex = 0;

        return {
            interrupted : this.interrupted, 
            target : this.target, 
            next() {
                if (interrupteIndex < this.interrupted.length) {
                    return { done: false, value: this.interrupted[interrupteIndex++] };
                }
                else if (index < this.target.length) {
                    return { done: false, value: this.target[index++] };
                } else {
                    return { done: true };
                }
            }
        };
    }

    interrupte(value:any) {
        this.interrupted.push(value);
    }
}