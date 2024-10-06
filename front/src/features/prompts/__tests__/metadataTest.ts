import { PromptMetadata } from '../';

import { handleAndGetError } from 'features/testUtils';

const args = {
    basePath : '',
    selects : {},
}

const TEST_PROFILE = 'test-profile';

describe('PromptMetadata', () => {
    test('Valid Metadata', () => {
        PromptMetadata.parse(TEST_PROFILE, {
            name : 'name',
            key : 'key',
            path : 'path',
        }, args);
    });

    test('Valid Metadata', () => {
        PromptMetadata.parse(TEST_PROFILE, {
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
    const varSelect = (name, show_in_header=false) => {
        return {
            name,
            display_name: name,
            type : 'select',
            options: [{name: 'option1', value: 'option1'}, {name: 'option2', value: 'option2'}],
            default_value: 'option1',
            show_in_header
        }
    }

    test('Variable', () => {
        const metadata = PromptMetadata.parse(TEST_PROFILE, {
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
    
    /*
        show_in_header 필드 작동 여부 확인
        selects 타입이면서 show_in_header가 true인 var만 showInHeaderVars에 추가되어야 함
    */
    test('show in header variable', () => {
        const metadata = PromptMetadata.parse(TEST_PROFILE, {
            name : 'name',
            key : 'key',
            path : 'path',
            vars : [
                varNum('num1'),
                varNum('num2', true),
                varSelect('select1'),
                varSelect('select2', true),
            ],
        }, args);

        expect(metadata.showInHeaderVars).toEqual([
            varSelect('select2', true),
        ]);
    });
});