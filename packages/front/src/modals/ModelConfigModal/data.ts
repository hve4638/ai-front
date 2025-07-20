export const safetyFilterThresholdMap: Record<string, number> = {
    'OFF': 0,
    'BLOCK_NONE': 1,
    'BLOCK_ONLY_HIGH': 2,
    'BLOCK_MEDIUM_AND_ABOVE': 3,
    'BLOCK_LOW_AND_ABOVE': 4,
}
export const safetyFilterThresholdMapReverse: Record<number, string> = {
    0: 'OFF',
    1: 'BLOCK_NONE',
    2: 'BLOCK_ONLY_HIGH',
    3: 'BLOCK_MEDIUM_AND_ABOVE',
    4: 'BLOCK_LOW_AND_ABOVE',
}