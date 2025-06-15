import { v7 as uuidv7 } from 'uuid';
import { IACSubStorage } from 'ac-storage';
import type IProfileRT from './IProfileRT';
import { PromptVarParser, RTFormParser } from '@/features/var-transformers';

class ProfileRT implements IProfileRT {
    constructor(private storage:IACSubStorage, private rtId:string) {
        
    }

    private async accessMetadata() {
        return await this.storage.accessAsJSON(`${this.rtId}:index.json`);
    }
    private async accessPrompt(promptId:string) {
        return await this.storage.accessAsJSON(`${this.rtId}:prompts:${promptId}`);
    }
    private async accessForm() {
        return await this.storage.accessAsJSON(`${this.rtId}:form.json`);
    }
    private async accessNode() {
        return await this.storage.accessAsJSON(`${this.rtId}:node.json`);
    }

    async getForms():Promise<PromptVar[]> {
        const indexAC = await this.accessMetadata();
        const formAC = await this.accessForm();

        const formIds:string[] = indexAC.getOne('forms') ?? [];
        return formIds.map((formId)=>{
            const form:RTForm = formAC.getOne(formId);
            
            const promptVar = RTFormParser.toPromptVar(form);
            // @TODO 필요한지 확인
            promptVar.id = formId;
            return promptVar;
        });
    }

    // node
    async getNodes():Promise<Record<string, any>> {
        const flowAC = await this.accessNode();
        const nodes = flowAC.getAll();

        return nodes;
    }

    async addNode(node:string):Promise<number> {
        const flowAC = await this.accessNode();
        const nodes = flowAC.getAll() ?? {};

        let nextId = 0;
        do { 
            nextId++;
        } while(nextId in nodes);
        const newNode = {
            id : nextId,
            node : node,
            option : {},
            forms : [],
            link_to : {},
            addition : {
                x : 0,
                y : 0,
            },
        }
        try {
            flowAC.set({ [nextId] : newNode });
            return nextId;
        }
        catch(e) {
            console.error("Failed to add node:", e);
            return -1;
        }
    }
    async removeNode(nodeId:number):Promise<boolean> {
        throw new Error("Not implemented yet");
    }
    async updateNodeOption(nodeId:number, option:Record<string, any>):Promise<boolean> {
        const flowAC = await this.accessNode();
        const node = flowAC.getOne(`${nodeId}`);
        if (!node) {
            return false;
        }
        flowAC.set({
            [nodeId] : {
                option : option
            }
        });
        return true;
    }
    async setEntrypoint(nodeId:number):Promise<void> {
        const metadataAC = await this.accessMetadata();
        const flowAC = await this.accessNode();
        const node = flowAC.getOne(`${nodeId}`);
        if (!node) {
            throw new Error(`Node '${nodeId}' not found`);
        }
        
        metadataAC.set({
            entrypoint_node : nodeId,
        });
    }

    async connectNode(nodeFrom:RTNodeEdge, nodeTo:RTNodeEdge):Promise<boolean> {
        const flowAC = await this.accessNode();
        const linkTo:Record<string, { node_id:number, input:string }[]> = flowAC.getOne(`${nodeFrom.nodeId}.link_to`) ?? {};
        
        linkTo[nodeFrom.ifName] ??= [];
        linkTo[nodeFrom.ifName].push({
            node_id : nodeTo.nodeId,
            input : nodeTo.ifName,
        })
        flowAC.setOne(`${nodeFrom.nodeId}.link_to`, linkTo);
        return true;
    }
    async disconnectNode(nodeFrom:RTNodeEdge, nodeTo:RTNodeEdge):Promise<boolean> {
        const flowAC = await this.accessNode();
        const linkTo:Record<string, { node_id:number, input:string }[]> = flowAC.getOne(`${nodeFrom.nodeId}.link_to`) ?? {};
        
        if (!linkTo[nodeFrom.ifName]) {
            return false;
        }
        else {
            const next = linkTo[nodeFrom.ifName].filter(
                (item)=>{
                    return !(
                        item.node_id === nodeTo.nodeId &&
                        item.input === nodeTo.ifName
                    );
                }
            );
            
            flowAC.setOne(
                `${nodeFrom.nodeId}.link_to`,
                next
            );
        }
        
        return true;
    }

    async getMetadata():Promise<RTIndex> {
        const indexAC = await this.accessMetadata();
        
        return indexAC.get('version', 'id', 'name', 'uuid', 'mode', 'input_type', 'form', 'entrypoint_node') as RTIndex;
    }
    async setMetadata(input:KeyValueInput):Promise<void> {
        const indexAC = await this.accessMetadata();
        
        indexAC.set(input);
    }

    async getPromptMetadata(promptId:string):Promise<RTPromptData> {
        const promptAC = await this.accessPrompt(promptId);

        const name = await this.getPromptName(promptId);
        let { id, variables, model } = promptAC.get('id', 'variables', 'model');
        model ??= {};
        
        return { id, name, variables, model } as RTPromptData;
    }
    /**
     * 특별한 처리를 필요로 하지 않는 프롬프트 메타데이터 갱신
     */
    async setPromptMetadata(promptId:string, input:RTPromptDataEditable):Promise<void> {
        const promptAC = await this.accessPrompt(promptId);

        if (input.name) {
            await this.setPromptName(promptId, input.name);
            delete input.name;
        }
        promptAC.set(input);

    }

    async getPromptName(promptId:string):Promise<string> {
        const indexAC = await this.accessMetadata();
        const promptAC = await this.accessPrompt(promptId);

        const { name, mode } = indexAC.get('name', 'mode');
        if (mode === 'prompt_only') {
            // prompt_only 모드에서는 rt 이름과 prompt 명이 동일
            return name;
        }
        else {
            return promptAC.getOne('name');
        }
    }
    async setPromptName(promptId:string, name:string):Promise<void> {
        const indexAC = await this.accessMetadata();
        const promptAC = await this.accessPrompt(promptId);

        const { mode } = indexAC.get('mode');
        if (mode === 'prompt_only') {
            // prompt_only 모드에서는 rt 이름과 prompt 명이 동일
            indexAC.setOne('name', name);
        }
        else {
            promptAC.setOne('name', name);
            
        }
    }

    async getPromptContents(promptId:string):Promise<string> {
        const promptAC = await this.accessPrompt(promptId);

        return promptAC.getOne('contents');
    }
    async setPromptContents(promptId:string, contents:string):Promise<void> {
        const promptAC = await this.accessPrompt(promptId);

        promptAC.setOne('contents', contents);
    }

    async getPromptVariableNames(promptId:string):Promise<string[]> {
        const promptAC = await this.accessPrompt(promptId);

        const variableNames:string[] = promptAC.getOne('variables') ?? [];
        return variableNames;
    }
    async getPromptVariables(promptId:string):Promise<PromptVar[]> {
        const promptAC = await this.accessPrompt(promptId);
        const formAC = await this.accessForm();

        const variables:{ form_id:string, name:string }[] = promptAC.getOne('variables') ?? [];
        return variables.map(({ form_id, name })=>{
            const form:RTForm = formAC.getOne(form_id);
            
            const promptVar = RTFormParser.toPromptVar(form);
            promptVar.id = form_id;
            promptVar.name = name;

            return promptVar;
        });
    }

    /**
     * 프롬프트 변수 추가 & 갱신
     * 
     * id가 없으면 id 할당 후 추가, id가 존재하면 상태만 갱신
     * 
     * @param promptId 
     * @param promptVars 
     * @returns 
     */
    async setPromptVariables(promptId:string, promptVars:PromptVar[]):Promise<string[]> {
        const promptAC = await this.accessPrompt(promptId);
        
        const variables:{ name:string, form_id:string }[] = promptAC.getOne('variables') ?? [];
        const varIds:string[] = [];
        for (const promptVar of promptVars) {
            let formId:string = '';
            try {
                // 이미 존재하면 갱신, 없으면 새로 생성
                if (!promptVar.id) {
                    formId = await this.addForm(promptVar);

                    variables.push({ name: promptVar.name, form_id: formId });
                }
                else {
                    formId = promptVar.id;

                    const v = variables.find(v => v.form_id === formId);
                    if (v) {
                        await this.updateForm(formId, promptVar);
                        v.name = promptVar.name;
                    }
                    else {
                        throw new Error(`Form ID '${formId}' not found in prompt variables`);
                    }
                }
        
                varIds.push(formId);
            }
            catch(e) {
                promptVar.id ??= 'unknown';
                const form = PromptVarParser.toRTForm(promptVar);

                console.error(`Failed to set prompt variables : ${promptVar.name} (${formId})`);
                console.error('variable : ', promptVar);
                console.error('form (transition) : ', form);
                
                throw e;
            }
        }
    
        promptAC.setOne('variables', variables);
        return varIds;
    }
    async removePromptVariables(promptId:string, varIds:string[]) {
        const indexAC = await this.accessMetadata();
        const promptAC = await this.accessPrompt(promptId);

        const variables:{ name:string, form_id:string, weak?:boolean }[] = promptAC.getOne('variables') ?? [];
        const formIds:string[] = indexAC.getOne('forms') ?? [];

        const removed:string[] = [];
        for (const varId of varIds) {
            const v = variables.find(v => v.form_id === varId);
            if (!v) continue;

            removed.push(varId);
            if (!v.weak) {
                this.removeForm(varId);
            }
        }

        const filteredVars = variables.filter((v)=>!removed.includes(v.form_id));
        promptAC.setOne('variables', filteredVars);
        
        const filteredIds = formIds.filter((id)=>!removed.includes(id));
        indexAC.setOne('forms', filteredIds);
    }

    private async addForm(promptVar:PromptVar):Promise<string> {
        const indexAC = await this.accessMetadata();
        const formAC = await this.accessForm();

        let formId:string;
        do {
            formId = uuidv7();
        } while (formAC.getOne(formId) != undefined);
        promptVar.id = formId;

        const form = PromptVarParser.toRTForm(promptVar);
        formAC.setOne(formId, form);
        
        const formIds = indexAC.getOne('forms') ?? [];
        indexAC.setOne('forms', [...formIds, formId]);

        return formId;
    }
    private async updateForm(formId:string, promptVar:PromptVar) {
        const formAC = await this.accessForm();

        promptVar.id = formId;
        const form = PromptVarParser.toRTForm(promptVar);
        
        formAC.setOne(formId, form);
    }
    private async removeForm(formId:string):Promise<void> {
        const formAC = await this.accessForm();
        
        formAC.removeOne(formId);
    }
}

export default ProfileRT;