import { CurlyBraceFormatBuildArgs, ExpressionEventHooks } from 'libs/curlyBraceFormat'

export const DEFAULT_BUILTIN_VARS = {
    blank: '',
    nl: '\n',
    newline: '\n',
} as const;

export const DEFAULT_EXPRESSION_EVENT_HOOKS = {
    add(a, b) {
        return a.value + b.value;
    },
    subtract(a, b) {
        return a.value - b.value;
    },
    multiply(a, b) {
        return a.value * b.value;
    },
    divide(a, b) {
        return a.value / b.value;
    },
    modulo(a, b) {
        return a.value % b.value;
    },
    greaterOrEqual(a, b) {
        return a.value >= b.value;
    },
    lessOrEqual(a, b) {
        return a.value <= b.value;
    },
    greater(a, b) {
        return a.value > b.value;
    },
    less(a, b) {
        return a.value < b.value;
    },
    notEqual(a, b) {
        return a.value != b.value;
    },
    equal(a, b) {
        return a.value == b.value;
    },
    logicalAnd(a, b) {
        return a.value && b.value;
    },
    logicalOr(a, b) {
        return a.value || b.value;
    },
    indexor(a, b) {
        return a.value[b.value as number | string];
    },
    stringify(expr) {
        if (expr.type === "OBJECT") {
             const data = expr.value;
             if (data.type === "OBJECT") {
                return JSON.stringify(data.value);
             }
             else {
                console.log("STRINGIFY", data.type)
                console.log(data)
                return data.type.toString();
             }
        }
        else {
            return expr.value.toString();
        }
    },
    iterate(expr) {
        if (expr.type === "OBJECT") {
            if (expr.value.type === "ARRAY") {
                return expr.value.value;
            }
            else {
                return Object.entries(expr.value.value);
            }
        }
        else {
            throw new Error("Value is not iterable.");
        }
    },
    access(expr, fieldNameExpr) {
        if (expr.type === "OBJECT") {
            return expr.value.value[fieldNameExpr.value as string];
        }
        else {
            throw new Error("Value is not an object.");
        }
    },
    call(a, b) {
        console.log("CALL")
        throw new Error("Not implemented : ");
    },
    objectify(obj) {
        if (Array.isArray(obj)) {
            return {
                type : "ARRAY",
                value : obj
            }
        }
        else {
            return {
                type : "OBJECT",
                value : obj
            }
        }
    }
} as const as ExpressionEventHooks;