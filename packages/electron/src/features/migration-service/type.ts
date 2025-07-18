import {
    PromptMetadata as LegacyPromptMetadata,
    PromptMetadataSublist as LegacyPromptMetadataList,
} from './LegacyPromptParser';

export interface LegacyAIFrontData {
    prompts: (LegacyPromptMetadata | LegacyPromptMetadataList)[];
}

export {
    LegacyPromptMetadataList,
    LegacyPromptMetadata
};