import { PromptMetadataParseError } from '../errors';
import { PromptMetadataTree } from '../promptMetadataTree';

import { handleAndGetError } from 'features/testUtils';

const makePMD = (key, name, path) => {
    return {
        key, name, path
    }
}

const TEST_PROFILE = 'test-profile';

describe('Tree verification', () => {
    test('No prompts', () => {
        const gen = ()=>new PromptMetadataTree(TEST_PROFILE, {} as any);

        const err = handleAndGetError(gen);
        expect(err).toBeInstanceOf(PromptMetadataParseError);
    });
    test('Empty prompts', () => {
        const root:any = {
            prompts: [],
        };
        const gen = () => new PromptMetadataTree(TEST_PROFILE, root);
        expect(gen).toThrow(PromptMetadataParseError);
    });
    test('Invalid prompts', () => {
        const root:any = {
            prompts: [
                {
                    key : 'prompt1',
                    name : 'Prompt1',
                }
            ],
        };

        const gen = () => new PromptMetadataTree(TEST_PROFILE, root);
        expect(gen).toThrow(PromptMetadataParseError);
    });
    test('Duplicate promptkey', () => {
        const root:any = {
            prompts: [
                {
                    key : 'prompt1',
                    name : 'Prompt1',
                    path : 'prompt1.md',
                },
                {
                    key : 'prompt1',
                    name : 'Prompt2',
                    path : 'prompt2.md',
                }
            ],
        };

        const gen = () => new PromptMetadataTree(TEST_PROFILE, root);
        expect(gen).toThrow(PromptMetadataParseError);
    });
    test('Valid tree', () => {
        const root:any = {
            prompts: [
                {
                    key : 'prompt1',
                    name : 'Prompt1',
                    path : 'prompt.md',
                }
            ],
        };
        const root2:any = {
            prompts: [
                makePMD('prompt1', 'Prompt1', 'prompt1.md'),
                {
                    key : 'prompt2',
                    name : 'Prompt2',
                    list : [
                        makePMD('prompt3', 'Prompt3', 'prompt3.md'),
                    ]
                }
            ],
        };
        
        const tree = new PromptMetadataTree(TEST_PROFILE, root);
        const tree2 = new PromptMetadataTree(TEST_PROFILE, root2);
    });
});

describe('Tree method', () => {
    test('First prompt', () => {
        const root:any = {
            prompts : [
                makePMD('1', '1', '1'),
                makePMD('2', '2', '2'),
            ]
        };
        const tree = new PromptMetadataTree(TEST_PROFILE, root);

        const metadata = tree.firstPrompt();
        expect(metadata.raw).toEqual(makePMD('1', '1', '1'));
    });
    test('List', () => {
        const tree = new PromptMetadataTree(TEST_PROFILE, {
            prompts : [
                makePMD('1', '1', '1'),
                makePMD('2', '2', '2'),
                makePMD('3', '3', '3'),
            ],
            selects : {}
        });

        const actual = tree.list.map(x=>x.raw);
        const expected = [
            makePMD('1', '1', '1'),
            makePMD('2', '2', '2'),
            makePMD('3', '3', '3'),
        ]
        expect(actual).toEqual(expected);
    });
    test('getPromptMetadata', () => {
        const tree = new PromptMetadataTree(TEST_PROFILE, {
            prompts : [
                makePMD('1', '1', '1'),
                makePMD('2', '2', '2'),
                makePMD('3', '3', '3'),
            ],
            selects : {}
        });

        const actual = tree.getPromptMetadata('2')?.raw;
        const expected = makePMD('2', '2', '2');
        expect(actual).toEqual(expected);
    });
    test('getPromptMetadata 2', () => {
        const tree = new PromptMetadataTree(TEST_PROFILE, {
            prompts : [
                makePMD('1', '1', '1'),
                makePMD('2', '2', '2'),
                makePMD('3', '3', '3'),
            ],
            selects : {}
        });

        const actual = tree.getPromptMetadata('5');
        expect(actual).toEqual(null);
    });
});












