import { PROMPT_METADATA_PARSE_ERRORS, PromptMetadataParseError } from "../errors";
import { PromptMetadataVerifier } from "../promptMetadataVerifier";
import { handleAndGetError } from "features/testUtils";

const tryParseTree = (tree:any) => {
    const treeText = JSON.stringify(tree);
    const verifier = new PromptMetadataVerifier();
    return verifier.parsePromptMetadataTree(treeText);
}
describe('PromptMetadataVerifier Error', () => {
    const expectMetadataParseError = (error:PromptMetadataParseError, errorType:PROMPT_METADATA_PARSE_ERRORS) => {
        expect(error).toBeInstanceOf(PromptMetadataParseError);
        expect(error.extraInfomation.errorType).toBe(errorType);
    }
    test('Invalid json format', () => {
        const verifier = new PromptMetadataVerifier();
        const expected = handleAndGetError(() => verifier.parsePromptMetadataTree('invalid json'));
        expectMetadataParseError(expected, PROMPT_METADATA_PARSE_ERRORS.INVALID_FORMAT);
    })
    test('Empty prompt', () => {
        const tree = JSON.stringify(
            {
            }
        );
        
        const expected = handleAndGetError(() => tryParseTree(tree));
        expectMetadataParseError(expected, PROMPT_METADATA_PARSE_ERRORS.NO_PROMPTS);
    });
    test('No field', () => {
        const expectNoFieldError = (tree)=>{
            const expected = handleAndGetError(() => tryParseTree(tree));
            expectMetadataParseError(expected, PROMPT_METADATA_PARSE_ERRORS.NO_FIELD);
        }

        expectNoFieldError({
            prompts: [
                {
                    name: 'test',
                }
            ]
        });
        expectNoFieldError({
            prompts: [
                {
                    key: 'test',
                }
            ]
        });
    });
});

describe('PromptMetadataVerifier Success', () => {
    test('PromptMetadata', () => {
        const prompts = [
            {
                key: 'test',
                name: 'test',
                path: 'test.md'
            }
        ]

        const [result, modules] = tryParseTree({
            prompts: prompts
        });

        expect(result).toEqual({
            prompts: prompts,
            selects : {},
        });
        expect(modules).toEqual([]);
    });

    test('PromptMetadataSublist', () => {
        const prompts = [
            {
                key: 'test',
                name: 'test',
                list: [],
            }
        ]

        const [result, modules] = tryParseTree({
            prompts: prompts
        });

        expect(result).toEqual({
            prompts: prompts,
            selects : {},
        });
        expect(modules).toEqual([]);
    });


    test('PromptImportMetadata', () => {
        const prompts = [
            {
                import : "module_0"
            }
        ]

        const [result, modules] = tryParseTree({
            prompts: prompts
        });

        expect(result).toEqual({
            prompts: prompts,
            selects : {},
        });
        expect(modules).toEqual(["module_0"]);
    });
    
    /// @TODO : 테스트 추가
});


describe('PromptMetadataVerifier Legacy', () => {
    test('Selectref', () => {
        const [result, modules] = tryParseTree({
            prompts: [],
            selectref: {}
        });

        expect(result).toEqual({
            prompts: [],
            selects : {},
        });
    });

    /// @TODO : 테스트 추가
});