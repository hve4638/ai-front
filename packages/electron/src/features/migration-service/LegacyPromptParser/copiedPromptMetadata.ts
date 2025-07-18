import { IPromptMetadata, VarMetadata } from "./types";

export class CopiedPromptMetadata implements IPromptMetadata {
    #original: IPromptMetadata;
    #vars: { [key: string]: any; } = {};

    constructor(original: IPromptMetadata) {
        this.#original = original;
        this.#vars = original.getAllVarValue()
    }
    commitCurrentVarValue(): void {
        for (const key in this.#vars) {
            this.#original.setVarValue(key, this.#vars[key]);
        }
    }
    setVarValue(varname: string, value: any): void {
        this.#vars[varname] = value;
    }
    getVarValue(varname: string) {
        return this.#vars[varname];
    }
    setVarValues(vars:{[key:string]:any}) {
        for (const key in vars) {
            this.#vars[key] = vars[key];
        }
    }
    getVarValues() {
        return { ...this.#vars };
    }
    get name(): string {
        return this.#original.name;
    }
    get display_name(): string {
        return this.#original.display_name;
    }
    get key(): string {
        return this.#original.key;
    }
    get vars(): VarMetadata[] {
        return this.#original.vars;
    }
    get showInHeaderVars(): VarMetadata[] {
        return this.#original.showInHeaderVars;
    }
    get path(): string {
        return this.#original.path;
    }
    get raw(): any {
        return this.#original.raw;
    }
    get indexes():[number, number|null] {
        return this.#original.indexes;
    }
    get promptTemplate(): string {
        return this.#original.promptTemplate;
    }
    getAllVarValue(): { [key: string]: any; } {
        return { ...this.#vars };
    }
    setIndexes(index1: number, index2: number): void {
        this.#original.setIndexes(index1, index2);
    }
    copy(): IPromptMetadata {
        const copied = this.#original.copy() as CopiedPromptMetadata;
        copied.#vars = this.getAllVarValue();

        return copied;
    }
    loadPromptTemplate(args) {
        return this.#original.loadPromptTemplate(args);
    }
}