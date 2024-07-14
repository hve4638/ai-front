//type Dict<KEY, VALUE> = {[key]:KEY:VALUE};

import { Note } from "../../../data/interface";
import { AIModels } from "../../chatAI/index.ts";

interface RequestArgs {
    contents:string;
    note:Note;
    prompt:string;
    modelName:string;
    modelCategory:string;
    secretContext:any;
}

interface enqueueAPIRequestArgs {
    onFetchStart:()=>void;
    onFetchComplete:(success:boolean, data:any)=>void;
    args:RequestArgs;
}

export class AIModelFetchManager {
    #requestQueues;
    #workers;

    constructor() {
        this.#requestQueues = {}
        this.#workers = {}
    }

    enqueueAPIRequest({
        onFetchStart,
        onFetchComplete,
        args
    }:enqueueAPIRequestArgs) {
        const category = args.modelCategory;
        if (!(category in this.#requestQueues)) {
            this.#requestQueues[category] = [];
        }
        this.#requestQueues[category].push({
            onFetchStart,
            onFetchComplete,
            args
        });

        if (!this.#isWorking(category)) {
            this.#runWorker(category);
        }
    }

    #isWorking(category:string) {
        return (category in this.#workers);
    }

    async #runWorker(category:string) {
        this.#workers[category] = 1;
        try {
            while(this.#requestQueues[category].length > 0) {
                const {
                    onFetchStart,
                    onFetchComplete,
                    args
                }:enqueueAPIRequestArgs = this.#requestQueues[category].shift();
                
                onFetchStart();
                const [success, result] = await this.#fetch({
                    contents : args.contents,
                    note : args.note,
                    prompt : args.prompt,
                    modelCategory : args.modelCategory,
                    modelName : args.modelName,
                }, {
                    secretContext: args.secretContext,
                    storeContext : null
                });
                onFetchComplete(success, result);
            }
        }
        catch(error) {
            console.error(error);
        }

        delete this.#workers[category];
    }

    async #fetch({contents, note, prompt, modelCategory, modelName}, {secretContext, storeContext}) {
        try {
            const data = await AIModels.request(
                {
                    contents: contents,
                    note: note,
                    prompt: prompt,
                    modelCategory : modelCategory,
                    modelName : modelName,
                },
                {
                    secretContext,
                }
            );

            return [true, data]
        }
        catch(err) {
            const data = {
                input : contents,
                output : '',
                prompt : prompt,
                note : note,
                tokens: 0,
                finishreason : 'EXCEPTION',
                normalresponse : false,
                warning : null,
                error: `${err}`
            };

            return [false, data];
        }
    }
}