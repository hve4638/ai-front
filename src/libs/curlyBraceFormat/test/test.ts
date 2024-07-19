import {CurlyBraceFormatParser} from '../'
import {Condition} from '../condition'
import {Constant} from '../constant'

describe('assert Test', () => {
    test('Constant Equality', () => {
        const constant1 = new Constant('text1');
        const constant2 = new Constant('text1');
        expect(constant1).toEqual(constant2)
    });
});
