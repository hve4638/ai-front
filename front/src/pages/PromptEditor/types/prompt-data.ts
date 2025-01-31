import { PromptVar } from 'types/prompt-variables';
import { PromptInputType } from 'types';

export type PromptData = {
    name : string;
    id : string;
    vars : PromptVar[];
    inputType : PromptInputType;
    promptContent : string;
}