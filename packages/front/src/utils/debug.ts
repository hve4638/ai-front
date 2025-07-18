export function checksum(str: string|null): number {
    if (str === null) {
        return 0;
    }
    let checksum = 0;
    for (let i = 0; i < str.length; i++) {
        checksum = (checksum + str.charCodeAt(i)) & 0xffffffff;
    }
    return checksum;
}