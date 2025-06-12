import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export function formatDateUTC(date?: Date): string {
    return formatInTimeZone(date ?? new Date(), 'UTC', 'yyMMdd-HHmmss');
}

export function formatDateLocal(date?: Date): string {
    return format(date ?? new Date(), 'yyMMdd-HHmmss');
}