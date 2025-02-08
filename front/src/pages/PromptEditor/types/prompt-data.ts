import { PromptInputType } from 'types';

export type PromptData = {
    name : string;
    id : string;
    vars : PromptVar[];
    inputType : PromptInputType;
    promptContent : string;
}