import { PromptMetadataParseError } from '../errors';
import { PromptMetadata } from '../';

import { handleAndGetError } from 'features/testUtils';

const args = {
    basePath : '',
    selects : {},
}

describe('PromptMetadata', () => {
    test('Valid Metadata', () => {
        const metadata = PromptMetadata.parse({
            name : 'name',
            key : 'key',
            path : 'path',
        }, args);
    });

    test('Valid Metadata', () => {
        const metadata = PromptMetadata.parse({
            name : 'name',
            key : 'key',
            path : 'path',
            vars : [
                {
                    name : 'num',
                    type : 'number',
                }
            ],
        }, args);
    });
});

describe('PromptMetadata variable', () => {
    const varNum = function(name, show_in_header=false):any { return { name : name, type : 'number', show_in_header } }
    const varNumDetail = function(name, show_in_header=false):any { return { name : name, type : 'number', display_name: name, default_value: 0, show_in_header } }
    test('Variable', () => {
        const metadata = PromptMetadata.parse({
            name : 'name',
            key : 'key',
            path : 'path',
            vars : [
                varNum('num1'),
                varNum('num2'),
                varNum('num3'),
            ],
        }, args);

        expect(metadata.vars).toEqual([
            varNumDetail('num1'),
            varNumDetail('num2'),
            varNumDetail('num3'),
        ]);
    });
    
    test('show in header variable', () => {
        const metadata = PromptMetadata.parse({
            name : 'name',
            key : 'key',
            path : 'path',
            vars : [
                varNum('num1'),
                varNum('num2'),
                varNum('num3', true),
            ],
        }, args);

        expect(metadata.showInHeaderVars).toEqual([
            varNumDetail('num3', true),
        ]);
    });
});