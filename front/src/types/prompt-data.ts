import { PromptInputType } from 'types';

export type PromptData = {
    id? : string;

    rtId : string;
    promptId : string;
    name : string;
    forms : PromptVar[];
    inputType : PromptInputType;
    contents : string;
}