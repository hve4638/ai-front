import { Vars } from "../../context/interface/promptInterface";
import { MainPrompt, SubPrompt } from "../../data/interface";

export class PromptInfomation {
    #raw:MainPrompt|SubPrompt;
    #selects:Vars;
    #headerExposureVars;
    #allVars;
    #list:PromptInfomation[]|null;

    constructor(data:MainPrompt|SubPrompt, {selects}) {
        this.#raw = data;
        this.#selects = selects;
        this.#allVars = [];
        this.#headerExposureVars = [];

        this.#validate(this.#raw);
        this.#parseVars(this.#raw, this.#selects);
        this.#parseList(this.#raw, this.#selects);
    }

    #validate(data:MainPrompt|SubPrompt) {
        if (!('key' in data)) throw this.#errorMissingField('key');
        if (!('name' in data)) throw this.#errorMissingField('name');
        if ('value' in data && 'list' in data) throw this.#error("Prompt must contain either 'value' or 'list', but both.");
        if (!('value' in data || 'list' in data)) throw this.#error("Prompt requires either 'value' or 'list'.")
    }

    #error(message:string) {
        return new Error(`Invalid PromptInfomation (key=${this.#raw?.key}) : ${message}`);
    }

    #errorMissingField(keyword:string) {
        return this.#error(`Missing field '${keyword}'`)
    }

    #parseVars(data:MainPrompt|SubPrompt, selects) {
        const vars:string|object[] = data.vars ?? [];
        
        for (const item of vars) {
            let target;
            if (typeof item === "string") {
                target = {
                    name : item,
                    type : "select",
                    select_ref : item
                };
            }
            else if (typeof item === "object") {
                target = { ...item };
                target.type ??= "select";
            }

            target.display_name ??= target.name;

            switch(target.type) {
            case "select":
            {
                let options:any[]|null = null;
                if (target.options) {
                    options = target.options;
                }
                else if (target.select_ref) {
                    if (target.select_ref in selects) {
                        options = selects[target.select_ref];
                    }
                    else {
                        throw new Error(`Invalid PromptInfomation (key=${this.#raw.key}) : invalid select_ref(${target.select_ref})`)
                    }
                }
                else {
                    throw new Error(`Invalid PromptInfomation (key=${this.#raw.key}) : prompt[type=select] must contain 'options' or 'select_ref')`)
                }

                if (options == null) throw new Error(`Invalid PromptInfomation (key=${this.#raw.key}) : Logic Error`);
                if (options.length == 0) throw this.#error('empty options');

                let default_value = target.default_value;
                if (default_value == null) {
                    default_value = options[0].value;
                }
                else {
                    let notfound = true;
                    for (const item of options) {
                        if (item.value == default_value) {
                            notfound = false;
                            break;
                        }
                    }
                    if (notfound) {
                        throw this.#error(`default_value '${default_value}' is not found in options`);
                    }
                }
                
                const data = {
                    ...target,
                    options : options,
                    default_value : default_value
                }
                this.#allVars.push(data);
                if (this.#headerExposureVars.length < 2) {
                    this.#headerExposureVars.push(data);
                }
                break;
            }
            case "text":
            case "text-multiline":
            {
                let data = {...target};
                data.default_value ??= "";

                this.#allVars.push(data);
                break;
            }
            case "check":
            case "integer":
            case "decimal":
                throw new Error("Not Implementation");
            }
        }
    }

    #parseList(data:MainPrompt|SubPrompt, selects) {
        if ('list' in data && data.list) {
            this.#list = [];
            
            for (const item of data.list) {
                this.#list.push(new PromptInfomation(item, {selects}));
            }
        }
        else {
            this.#list = null;
        }
    }
    
    get name() {
        return this.#raw.name;
    }
    get value() {
        return this.#raw.value;
    }
    get key() {
        return this.#raw.key;
    }
    get list() {
        return this.#list;
    }
    get allVars() {
        return this.#allVars;
    }
    get headerExposuredVars() {
        return this.#headerExposureVars;
    }
}