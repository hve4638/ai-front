export const Align = {
    Start: 'flex-start',
    Center: 'center',
    End: 'flex-end',
    SpaceBetween: 'space-between',
    SpaceAround: 'space-around',
    SpaceEvenly: 'space-evenly',
} as const;
export type Align = typeof Align[keyof typeof Align];
