export function formatDateUTC(date?: Date): string {
    date ??= new Date();
    
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return `${String(year).slice(2)}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}${String(seconds).padStart(2, '0')}`;
}

export function formatDateLocal(date?: Date): string {
    date ??= new Date();
    
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${String(year).slice(2)}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}${String(seconds).padStart(2, '0')}`;
}