import { PromptBuilder, Role } from './statementUtils'
import type { CurlyBraceFormatBuildArgs } from './interface'
import { CBFRawErrorWarper } from './cbfRawErrorWarper'
import { StatementError } from './statementUtils/statements/errors'
import { HookEvaluationError } from './statementUtils/statements/elements/expressionUtils/error'

export const RE_DIRECTIVE_MARKER = /(\{\{::.*?\}\})/ms
export const RE_DIRECTIVE = /\{\{\s*::\s*(\S+)(?:\s+(.*?))?\s*\}\}/ms
export const RE_EXPRESSION_MARKER = /(\{\{[^{}]*?\}\})/ms
export const RE_EXPRESSION = /\{\{\s*(.*?)\s*\}\}/ms

export class CurlyBraceFormatParser {
    #promptTemplateText:string;
    #promptBuilder:PromptBuilder;

    constructor(promptTemplateText:string) {
        const errorWraper = new CBFRawErrorWarper();
        const promptBuilder = new PromptBuilder();
        this.#promptBuilder = promptBuilder;
        this.#promptTemplateText = promptTemplateText;

        // Error Trace 를 위함
        let lastText = '';
        let lastPosition = 0;
        
        promptBuilder.beginBuild();
        const splitTemplateParts = promptTemplateText.split(RE_DIRECTIVE_MARKER);
        try {
            for (const item of splitTemplateParts) {
                let group;
                if (group = item.match(RE_DIRECTIVE)) {
                    const keyword = group[1] as string;
                    const field = group[2] as string;

                    const hint = {
                        position : lastPosition,
                        text : item
                    }
                    lastText = item;
                    lastPosition += item.length;
                    
                    switch (keyword.toLowerCase()) {
                        case 'role':
                            promptBuilder.addRole(field, hint);
                            break;
                        case 'if':
                            promptBuilder.beginIf(field, hint);
                            break;
                        case 'elif':
                        case 'elseif':
                            promptBuilder.beginElseIf(field, hint);
                            break;
                        case 'else':
                            promptBuilder.beginElse(hint);
                            break;
                        case 'endif':
                            promptBuilder.endIf(hint);
                            break;
                        case 'foreach':
                            promptBuilder.beginForeach(field, hint);
                            break;
                        case 'endforeach':
                            promptBuilder.endForeach(hint);
                            break;
                        default:
                            throw new Error(`Invalid keyword '${keyword}'`);
                    }
                }
                else {
                    const {
                        left,
                        trimmed,
                        right
                    } = this.#trimText(item);
                    // position 계산시 줄바꿈은 제외되므로 제거후 계산
                    lastPosition += left.replaceAll('\n', '').length;

                    const splitExpressions = trimmed.split(RE_EXPRESSION_MARKER);
                    for (const item of splitExpressions) {
                        if (item === '') continue;
                        lastText = item;
                        const hint = {
                            position : lastPosition,
                            text : item
                        }
                        
                        if (group = item.match(RE_EXPRESSION)) {
                            promptBuilder.addExpression(group[1], hint);
                        }
                        else {
                            promptBuilder.addConstant(item, hint);
                        }
                    }
                    lastPosition += right.replaceAll('\n', '').length;
                }
            }
        }
        catch (error) {
            const [line, column] = errorWraper.splitPositionToLineColumn(lastPosition, promptTemplateText);
            
            throw errorWraper.warp(
                error,
                {
                    line:line+1,
                    column,
                    text:lastText
                }
            );
        }
        
        promptBuilder.endBuild();
    }

    #trimText(text:string) {
        const leftTrimmed = text.trimStart();
        const trimmed = leftTrimmed.trimEnd();
        const originalLength = text.length;
        const leftLength = originalLength - leftTrimmed.length;
        const rightLength = originalLength - leftLength - trimmed.length;
        
        return {
            left : text.slice(0, leftLength),
            trimmed : trimmed,
            right : leftTrimmed.slice(originalLength-rightLength)
        }
    }

    build(buildArgs:CurlyBraceFormatBuildArgs) {
        const errorWraper = new CBFRawErrorWarper();
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
        
        let lastElement:{data:any, hint:{position:null, text:string}}|undefined;
        try {
            for (const element of this.#promptBuilder.elements()) {
                lastElement = element;

                if (element.data instanceof Role) {
                    updateContents();
                    role = element.data.build(buildArgs);
                }
                else {
                    role ??= 'user';
                    promptParts.push(element.data.build(buildArgs));
                }
            }
            updateContents();
        }
        catch (error:any) {
            let text:string;
            let position:number;
            if (error instanceof StatementError) {
                text = error.hint?.text ?? '';
                position = error.hint?.position ?? 0;
                error = error.error;
            }
            else {
                text = lastElement?.hint?.text ?? '';
                position = lastElement?.hint?.position ?? 0;
            }
            const [ line, column ] = errorWraper.splitPositionToLineColumn(position, this.#promptTemplateText);
            
            throw errorWraper.warp(error, { line:line+1, column, text });
        }

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