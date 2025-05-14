import { PromptInputType } from '@/types';

/**
 * PromptEditor 내에서 사용하는 프롬프트 데이터
 */
export type PromptEditorData = {
    rtId : string;
    promptId : string;

    name : string | null;
    variables : PromptVar[];
    changedVariables : PromptVar[];
    removedVariables : string[];
    contents : string;
    config : {
        inputType : PromptInputType;
        // modelLimit : 'nothing' | '';
    }

    changed : Partial<{
        name : boolean;
        contents : boolean;
        config : boolean;
    }>;
    flags : Partial<{
        syncRTName : boolean;
    }>;
}