import { MainPrompt, SubPrompt } from '../data/interface.tsx'

// function findPromptAsKey(prompts:MainPrompt[], key1:string): MainPrompt|SubPrompt|undefined;

export function findPromptAsKey(prompts:MainPrompt[], key1:string, key2:string) {
    const mainPrompt = findMainPromptAsKey(prompts, key1);

    if (mainPrompt?.list == undefined) {
        return mainPrompt;
    }
    else
    {
        for (const item of mainPrompt.list) {
            if (item.key == key2) {
                return item;
            }
        }
    }
    
    return undefined;
}

export function findMainPromptAsKey(prompts:MainPrompt[], key1:string) {
    for (const item of prompts) {
      if (item.key == key1) {
        return item;
      }
    }
    return undefined;
}

export function findSubPromptAsKey(prompts:MainPrompt[], key1:string, key2:string) {
    const mainPrompt = findMainPromptAsKey(prompts, key1);

    if (mainPrompt?.list == undefined) {
        return undefined;
    }
    else
    {
        for (const item of mainPrompt.list) {
            if (item.key == key2) {
                return item;
            }
        }
    }
    return undefined;
}