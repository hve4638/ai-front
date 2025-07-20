import { JSONType } from 'ac-storage';

export const SAFETY_SETTING_THRESHOLD = JSONType.Union(
    'OFF',
    'BLOCK_NONE',
    'BLOCK_ONLY_HIGH',
    'BLOCK_MEDIUM_AND_ABOVE',
    'BLOCK_LOW_AND_ABOVE',
).nullable().default_value('OFF');