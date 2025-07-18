import { ExpressionEventHooks } from "@hve/prompt-template/dist/expr-eval/types/expr-hooks";

export const BUILT_IN_VARS = {
    'blank' : '',
    'nl' : '\n',
} as const;
export const HOOKS:Partial<ExpressionEventHooks> = {
    objectify(value) {
        return value;
    },
    access(obj, key) {
        if (typeof obj !== 'object' || obj == null) {
            console.trace('[FAIL] access()')
            console.error(obj, key);
            throw new Error(`Cannot access property ${key} of ${obj}`);
        }
        else if (key in obj) {
            return obj[key];
        }
        else {
            console.trace('[FAIL] access()')
            console.error(obj, key);
            throw new Error(`Property ${key} not found in ${obj}`);
        }
    },
    indexor(obj, index) {
        if (!Array.isArray(obj)) {
            console.trace('[FAIL] indexor()')
            console.error(obj, index);
            throw new Error(`Property is not an array: ${obj}`);
        }
        if (typeof index !== 'number') {
            console.trace('[FAIL] indexor()')
            console.error(obj, index);
            throw new Error(`Index is not a number: ${index}`);
        }
        
        if (index >= 0 && index < obj.length) {
            return obj[index];
        }
        else {
            console.trace('[FAIL] indexor()')
            console.error(obj, index);
            throw new Error(`Index out of bounds: ${index}`);
        }
    },
    iterate(obj:unknown) {
        if (typeof obj !== 'object' || obj == null) {
            throw new Error(`Cannot iterate over ${obj}`);
        }
        else if (Array.isArray(obj)) {
            return obj.values();
        }
        else {
            throw new Error('Not Implemented');
        }
    }
}