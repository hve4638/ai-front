export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function remapDecimal(
    value: number,
    from: { min: number; max: number },
    to: { min: number; max: number }
): number {
    const clamped = Math.max(from.min, Math.min(value, from.max));
    const ratio = (clamped - from.min) / (from.max - from.min);

    return to.min + ratio * (to.max - to.min);
}
