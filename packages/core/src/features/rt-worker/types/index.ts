import type { Profile } from "@/features/profiles";

export type ChatRequestForm = {
    bulitInVars : Record<string, any>;
    vars:Record<string, any>;
    modelId:string;
}

export type GlobalRTFlowData = {
    profile:Profile;
    rtId:string;
    modelId:string;
}

export type WorkLog = {
    type : 'node_begin'|'node_end';
    nodeId : number;
} | {
    type : 'node_error'|'node_warning'|'node_info'|'node_debug';
    nodeId : number;
    message : string[];
} | {
    type : 'work_begin'|'work_end';
    message? : string[];
};