import { PromptInputType } from 'types';

export type PromptData = {
    id : string;
    name : string;
    forms : PromptVar[];
    inputType : PromptInputType;
    contents : string;
}