import {
    PromptFS,
    PromptMetadataTree,
    PromptMetadataVerifier,
} from './LegacyPromptParser'
import { PROMPT_METADATA_PARSE_ERRORS, PromptMetadataParseError } from './LegacyPromptParser/errors';
import { RawPromptMetadataElement } from './LegacyPromptParser/types';

class AIFrontPromptLoader {
    static async loadTree(): Promise<PromptMetadataTree|null> {
        let rootContents: string;
        rootContents = await PromptFS.readPromptMetadata("list.json");

        if (rootContents.startsWith('@FAIL')) {
            console.warn('프롬프트 로딩 실패 : list.json', rootContents);
            return null;
        }

        try {
            const verifier = new PromptMetadataVerifier();

            const [rawTree, modules] = verifier.parsePromptMetadataTree(
                rootContents,
                {
                    name: "root",
                }
            );

            const externalPromptMetadata: {
                [key: string]: RawPromptMetadataElement
            } = {};

            for (const moduleName of modules) {
                if (!moduleName.match(/\w+/)) {
                    throw new PromptMetadataParseError(
                        'Invalid Module Name',
                        {
                            errorType: PROMPT_METADATA_PARSE_ERRORS.INVALID_MODULE_NAME,
                            target: `module name : ${moduleName}`,
                        }
                    )
                }

                const moduleContent = await PromptFS.readPromptMetadata(moduleName + "/index.json");
                if (moduleContent.startsWith('@FAIL')) {
                    throw new PromptMetadataParseError(
                        'PromptMetadata Load Failed',
                        {
                            errorType: PROMPT_METADATA_PARSE_ERRORS.INVALID_MODULE_NAME,
                            target: `module name : ${moduleName}\n\n${moduleContent}`,
                        }
                    )
                }

                const metadata = verifier.parseModulePromptMetadata(
                    moduleContent,
                    {
                        name: moduleName,
                    }
                );
                externalPromptMetadata[moduleName] = metadata;
            }

            return new PromptMetadataTree(rawTree, externalPromptMetadata);
        }
        catch (e: unknown) {
            if (e instanceof PromptMetadataParseError) {
                console.warn(
                    `PromptMetadata Parse Failed :: ${e.extraInfomation?.errorType}`,
                    `${e.message}\n\n${e.extraInfomation?.target ?? ''}`
                );
            }
            else if (e instanceof Error) {
                console.warn(
                    `PromptMetadata Parse Failed (${e.name})`,
                    `${e.message}\n\n${e.stack}`
                );
            }
            else {
                console.warn('PromptMetadata Parse Failed', (e as any).toString());
            }
            return null;
        }
    }
}

export default AIFrontPromptLoader;