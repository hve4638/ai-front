import { Expression } from '../';
import { ExpressionType, IdentifierExpression, LiteralExpression, ObjectExpression, ParamExpression } from '../expressionParser';

const notest = (a, b) => {}

describe('Expression Test', () => {
    const EMPTY_ARGS = { vars : {}, expressionEventHooks : {}, builtInVars:{} }
    test('numberliteral', ()=>{
        const expression = new Expression('10');
        const actual = expression.evaluate(EMPTY_ARGS);
        expect(actual).toEqual(10);
    });
    test('string literal', ()=>{
        const expression = new Expression('"hello world"');
        const actual = expression.evaluate(EMPTY_ARGS);
        expect(actual).toEqual('hello world');
    });
    test('operation', ()=>{
        const expression = new Expression('1 + 2');

        const actual = expression.evaluate(EMPTY_ARGS);
        expect(actual).toEqual(3);
    });
    test('variable', ()=>{
        const expression = new Expression('num');

        const actual = expression.evaluate({
            ...EMPTY_ARGS,
            vars : {
                'num' : 5
            }
        });
        expect(actual).toEqual(5);
    });
    test('variable + literal sum', ()=>{
        const expression = new Expression('num + 5');

        const actual = expression.evaluate({
            ...EMPTY_ARGS,
            vars : {
                'num' : 5
            }
        });
        expect(actual).toEqual(10);
    });
    test('indexor', ()=>{
        const expression = new Expression('array[1]');

        const actual = expression.evaluate({
            ...EMPTY_ARGS,
            vars : {
                'array' : {
                    raw : [0, 1, 2, 3]
                }
            },
            expressionEventHooks : {
                'indexor' : function(array, index) {
                    return array.value.raw.at(index.value);
                }
            }
        });
        expect(actual).toEqual(1);
    });
    test('function', ()=>{
        const expression = new Expression('print()');

        const actual = expression.evaluate({
            ...EMPTY_ARGS,
            vars : {
                'print' : {
                    rawvalue : 'hello world',
                    call : function() {
                        return this.rawvalue;
                    }
                }
            },
            expressionEventHooks : {
                'call' : function(obj, args) {
                    return obj.value.call([...args]);
                }
            }
        });
        expect(actual).toEqual('hello world');
    });
    test('function with args', ()=>{
        const expression = new Expression('sum(1, 2+3, 4*5)');

        const actual = expression.evaluate({
            ...EMPTY_ARGS,
            vars : {
                'sum' : {
                    call : function(a, b, c) {
                        return a.value + b.value + c.value;
                    }
                }
            },
            expressionEventHooks : {
                'call' : function(obj, args) {
                    return obj.value.call.apply(obj.value, args);
                }
            }
        });
        expect(actual).toEqual(1 + 2 + 3 + 4*5);
    });
    test('access', ()=>{
        const expression = new Expression('data.size');

        const actual = expression.evaluate({
            ...EMPTY_ARGS,
            vars : {
                'data' : {
                    field : {
                        'size' : 10
                    },
                    access : function(key) {
                        return this.field[key];
                    }
                }
            },
            expressionEventHooks : {
                'access' : function(obj, index) {
                    return obj.value.access.apply(obj.value, [index.value]);
                }
            }
        });
        expect(actual).toEqual(10);
    })
    test('identifier in indexor', ()=>{
        const expression = new Expression('data[value]');

        const actual = expression.evaluate({
            ...EMPTY_ARGS,
            vars : {
                'data' : {
                    array : [0, 1, 2, 3, 4],
                },
                'value' : {
                    value : 3
                }
            },
            expressionEventHooks : {
                'indexor' : function(array, index:LiteralExpression|ObjectExpression) {
                    const arr = array.value.array;
                    if (index.type === ExpressionType.LITERAL) {
                        return arr.at(index.value as number);
                    }
                    else {
                        return arr.at((index.value as any).value as number);
                    }
                }
            }
        });
        expect(actual).toEqual(3);
    })
    test('chain 1', ()=>{
        const expression = new Expression('data.get()');

        const actual = expression.evaluate({
            ...EMPTY_ARGS,
            vars : {
                'data' : {
                    field : {
                        'get' : {
                            call : function() {
                                return 2;
                            }
                        }
                    }
                }
            },
            expressionEventHooks : {
                'access' : function(obj, key) {
                    return obj.value.field[key.value];
                },
                'call' : function(callerExpr:ObjectExpression, argsExpr:ParamExpression) {
                    const caller = callerExpr.value.call;
                    const args = argsExpr.args;
                    return caller.apply(callerExpr.value, args);
                }
            }
        });
        expect(actual).toEqual(2);
    })
    
    test('chain 2', ()=>{
        const expression = new Expression('data.get()[1][2]');
        const array = (rawarray)=>{
            return { array : rawarray }
        }

        const actual = expression.evaluate({
            ...EMPTY_ARGS,
            vars : {
                'data' : {
                    field : {
                        'get' : {
                            array : array([
                                array([0, 1, 2]),
                                array([3, 4, 5]),
                                array([6, 7, 8]),
                            ]),
                            call : function() {
                                return this.array;
                            }
                        }
                    }
                }
            },
            expressionEventHooks : {
                'access' : function(objExpr, keyExpr) {
                    return objExpr.value.field[keyExpr.value];
                },
                'indexor' : function(arrayExpr, indexExpr) {
                    return arrayExpr.value.array[indexExpr.value];
                },
                'call' : function(callerExpr:ObjectExpression, argsExpr:ParamExpression) {
                    const caller = callerExpr.value.call;
                    const args = argsExpr.args;
                    return caller.apply(callerExpr.value, args);
                }
            }
        });
        expect(actual).toEqual(5);
    })
});
