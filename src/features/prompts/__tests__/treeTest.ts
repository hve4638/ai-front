import { PromptMetadataParseError } from '../errors';
import { PromptMetadataTree } from '../promptMetadataTree';

import { handleAndGetError } from 'features/testUtils';

const makePMD = (key, name, path) => {
    return {
        key, name, path
    }
}

describe('Tree verification', () => {
    test('No prompts', () => {
        const gen = ()=>new PromptMetadataTree({} as any);

        const err = handleAndGetError(gen);
        expect(err).toBeInstanceOf(PromptMetadataParseError);
    });
    test('Empty prompts', () => {
        const gen = () => new PromptMetadataTree({
            prompts: [],
        });
        expect(gen).toThrow(PromptMetadataParseError);
    });
    test('Invalid prompts', () => {
        const gen = () => new PromptMetadataTree({
            prompts: [
                {
                    key : 'prompt1',
                    name : 'Prompt1',
                }
            ],
        });
        expect(gen).toThrow(PromptMetadataParseError);
    });
    test('Duplicate promptkey', () => {
        const gen = () => new PromptMetadataTree({
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
        });
        expect(gen).toThrow(PromptMetadataParseError);
    });
    test('Valid tree', () => {
        const gen = () => new PromptMetadataTree({
            prompts: [
                {
                    key : 'prompt1',
                    name : 'Prompt1',
                    path : 'prompt.md',
                }
            ],
        });
        gen();
    });
    test('Valid tree', () => {
        const gen = () => new PromptMetadataTree({
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
        });
        gen();
    });
});

describe('Tree method', () => {
    test('first prompt', () => {
        const tree = new PromptMetadataTree({
            prompts : [
                makePMD('1', '1', '1'),
                makePMD('2', '2', '2'),
            ]
        });

        const metadata = tree.firstPrompt();
        expect(metadata.raw).toEqual(makePMD('1', '1', '1'));
    });
    test('list', () => {
        const tree = new PromptMetadataTree({
            prompts : [
                makePMD('1', '1', '1'),
                makePMD('2', '2', '2'),
                makePMD('3', '3', '3'),
            ]
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
        const tree = new PromptMetadataTree({
            prompts : [
                makePMD('1', '1', '1'),
                makePMD('2', '2', '2'),
                makePMD('3', '3', '3'),
            ]
        });

        const actual = tree.getPromptMetadata('2')?.raw;
        const expected = makePMD('2', '2', '2');
        expect(actual).toEqual(expected);
    });
    test('getPromptMetadata 2', () => {
        const tree = new PromptMetadataTree({
            prompts : [
                makePMD('1', '1', '1'),
                makePMD('2', '2', '2'),
                makePMD('3', '3', '3'),
            ]
        });

        const actual = tree.getPromptMetadata('5');
        expect(actual).toEqual(null);
    });
});












