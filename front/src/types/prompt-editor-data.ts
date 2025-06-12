import { PromptInputType } from '@/types';

/**
 * PromptEditor 내에서 사용하는 프롬프트 데이터
 */
export type PromptEditorData = {
    rtId : string;
    promptId : string;

    name : string | null;
    version: string;
    variables : PromptVar[];
    changedVariables : PromptVar[];
    removedVariables : string[];
    contents : string;
    model: {
        temperature: number;
        topP: number;
        maxTokens: number;
    };
    
    config : {
        inputType : PromptInputType;
        // modelLimit : 'nothing' | '';
    }

    changed : Partial<{
        name : boolean;
        contents : boolean;
        config : boolean;
        version : boolean;
        model: boolean;
    }>;
    flags : Partial<{
        syncRTName : boolean;
    }>;
}