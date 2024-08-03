import { Chain, VarField, VarFunction, VarIndexor } from '../expressionParser/chain';
import { Var } from '../expressionParser/symbol/var'
import { VarStruct } from '../../interface'

describe('VarStruct Test', () => {
    const varstruct:VarStruct = {
        value : 'array[]',
        array : [
            'value0',
            'value1',
            'value2',
        ],
        fields : {
            length : 3,
        },
        functions : {
            last : function() {
                return this.array[2];
            },
            sum : function(a, b) {
                return a + b;
            }
        }
    }
    const note = {
        vars : {
            'testvar' : varstruct
        },
        reservedVars : {},
    }

    test('Value', () => {
        const chain = new Chain(new Var('testvar'));

        const expected = chain.build(note);
        expect(expected).toEqual('array[]');
    });

    test('Field', () => {
        const chain = new Chain(new Var('testvar'));
        chain.add(new VarField('length'));

        const expected = chain.build(note);
        expect(expected).toEqual(3);
    });

    test('indexor', ()=>{
        {
            const chain = new Chain(new Var('testvar'));
            chain.add(new VarIndexor(0));
            expect(chain.build(note)).toEqual('value0');
        }
        {
            const chain = new Chain(new Var('testvar'));
            chain.add(new VarIndexor(-1));
            expect(chain.build(note)).toEqual('value2');
        }
    });

    test('Function with This', ()=>{
        const chain = new Chain(new Var('testvar'));
        chain.add(new VarFunction('last', []));

        const expected = chain.build(note);
        expect(expected).toEqual('value2');
    });

    test('Function with Args', ()=>{
        const chain = new Chain(new Var('testvar'));
        chain.add(new VarFunction('sum', [2, 3]));

        const expected = chain.build(note);
        expect(expected).toEqual(5);
    });
});
