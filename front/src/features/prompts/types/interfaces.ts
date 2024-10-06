import { VarMetadata } from "./varMetadataType"

export interface IPromptMetadata {
    get name():string;
    get display_name():string;
    get key():string;
    get vars():VarMetadata[];
    get showInHeaderVars():VarMetadata[];
    get path():string;
    get raw():any;
    get indexes():[number, number|null];
    get promptTemplate():string;
    commitCurrentVarValue():void;
    setVarValue(varname:string, value:any):void;
    getVarValue(varname:string):any;
    setVarValues(vars:{[key:string]:any}):void;
    getVarValues():{[key:string]:any};
    getAllVarValue():{[key:string]:any};
    setIndexes(index1:number, index2:number):void;
    copy():IPromptMetadata;

    loadPromptTemplate({onFail}:{onFail:(err:Error)=>void}):Promise<void>;
}