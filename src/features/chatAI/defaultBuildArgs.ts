import { CurlyBraceFormatBuildArgs, ExpressionEventHooks } from 'libs/curlyBraceFormat'

export const DEFAULT_BUILTIN_VARS = {
  blank : '',
  nl : '\n',
  newline : '\n',
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
    return a.value[b.value as number|string];
  },
  stringify(a) {
    return a.value.toString();
  },
  iterate(a) {
    return a[Symbol.iterator]();
  },
  access(a, b) {
    throw new Error('Not implemented');
  },
  call(a, b) {
    throw new Error('Not implemented');
  } 
} as const as ExpressionEventHooks;