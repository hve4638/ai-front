import { formatDateLocal, formatDateUTC } from './date';
import { describe, expect, test } from 'vitest';

describe('formatDateUTC', () => {
    test('should format date in UTC', () => {  
        const date = new Date(Date.UTC(2024, 5, 1, 12, 30, 0)); 
        const formattedDate = formatDateUTC(date); 

        expect(formattedDate).toEqual('240601-123000');
    });
});