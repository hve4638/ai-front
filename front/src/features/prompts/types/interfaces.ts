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
    /**
     * 복사본 객체의 VarValue를 원본 객체에 반영
     */
    commitCurrentVarValue():void;
    setVarValue(varname:string, value:any):void;
    getVarValue(varname:string):any;
    setVarValues(vars:{[key:string]:any}):void;
    getVarValues():{[key:string]:any};
    getAllVarValue():{[key:string]:any};
    setIndexes(index1:number, index2:number):void;
    /**
     * VarValue 정보를 제외하고 Original을 참조하는 얕은 복사본을 반환
     * 
     * VarValue은 각 사본마다 독립적으로 작동
    */
    copy():IPromptMetadata;

    loadPromptTemplate({onFail}:{onFail:(err:Error)=>void}):Promise<void>;
}