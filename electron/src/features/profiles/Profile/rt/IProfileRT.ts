interface IProfileRT {
    getNodes():Promise<Record<string, any>>;
    addNode(nodeCategory:string):Promise<number>;
    removeNode(nodeId:number):Promise<boolean>;
    connectNode(nodeFrom:{ nodeId:number, ifName:string }, nodeTo:{ nodeId:number, ifName:string }):Promise<boolean>;
    disconnectNode(nodeFrom:{ nodeId:number, ifName:string }, nodeTo:{ nodeId:number, ifName:string }):Promise<boolean>;

    getMetadata():Promise<Record<string, any>>;
    setMetadata(input:KeyValueInput):Promise<void>;

    getPromptContents(promptId:string):Promise<string>;
    setPromptContents(promptId:string, contents:string):Promise<void>;
    getPromptVariables(promptId:string):Promise<PromptVar[]>;
    setPromptVariables(promptId:string, vars:PromptVar[]):Promise<string[]>;
    removePromptVariables(promptId:string, varName:string[]):Promise<void>;
}

export default IProfileRT;