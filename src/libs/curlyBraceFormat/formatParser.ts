import { PromptBuilder, Role } from './statementUtils'
import type { CurlyBraceFormatBuildArgs } from './interface'

export const RE_DIRECTIVE_MARKER = /(\{\{::.*?\}\})/ms
export const RE_DIRECTIVE = /\{\{\s*::\s*(\S+)(?:\s+(.*?))?\s*\}\}/ms
export const RE_EXPRESSION_MARKER = /(\{\{[^{}]*?\}\})/ms
export const RE_EXPRESSION = /\{\{\s*(.*?)\s*\}\}/ms

export class CurlyBraceFormatParser {
    #promptBuilder:PromptBuilder;

    constructor(promptTemplateText:string) {
        const promptBuilder = new PromptBuilder();

        this.#promptBuilder = promptBuilder;
        promptBuilder.beginBuild();
        const splitTemplateParts = promptTemplateText.split(RE_DIRECTIVE_MARKER);
        for (const item of splitTemplateParts) {
            let group;
            if (group = item.match(RE_DIRECTIVE)) {
                const keyword = group[1] as string;
                const field = group[2] as string;
                
                switch (keyword.toLowerCase()) {
                    case 'role':
                        promptBuilder.addRole(field);
                        break;
                    case 'if':
                        promptBuilder.beginIf(field);
                        break;
                    case 'elif':
                    case 'elseif':
                        promptBuilder.beginElseIf(field);
                        break;
                    case 'else':
                        promptBuilder.beginElse();
                        break;
                    case 'endif':
                        promptBuilder.endIf();
                        break;
                    case 'foreach':
                        promptBuilder.beginForeach(field);
                        break;
                    case 'endforeach':
                        promptBuilder.endForeach();
                        break;
                    default:
                        throw new Error(`Invalid keyword '${keyword}'`);
                }
            }
            else {
                const splitExpressions = item.trim().split(RE_EXPRESSION_MARKER)
                for (const item of splitExpressions) {
                    if (item === '') {
                        // nothing to do
                    }
                    else if (group = item.match(RE_EXPRESSION)) {
                        promptBuilder.addExpression(group[1]);
                    }
                    else {
                        promptBuilder.addConstant(item);
                    }
                }
            }
        }
        promptBuilder.endBuild();
    }

    build(buildArgs:CurlyBraceFormatBuildArgs) {
        const contents:{ role:string,text:string }[] = [];
        let role:string|null = null;
        let promptParts = [] as string[];

        const updateContents = () => {
            if (role === null) {
                return;
            }
            const content = {
                role : role,
                text : promptParts.join('')
            };
            contents.push(content);

            role = null;
            promptParts = [];
        }
        
        for (const element of this.#promptBuilder.elements()) {
            if (element instanceof Role) {
                updateContents();

                role = element.build(buildArgs);
            }
            else {
                role ??= 'user';

                promptParts.push(element.build(buildArgs));
            }
        }
        updateContents();

        const {
            map = (x)=>x
        } = buildArgs;
        const result:any = [];
        for (const content of contents) {
            result.push(map(content.text, content.role));
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

    interrupt(value:any) {
        this.interrupted.push(value);
    }
}