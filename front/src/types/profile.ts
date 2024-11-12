export const LayoutModes = {
    AUTO : 'auto',
    VERTICAL : 'vertical',
    HORIZONTAL : 'horizontal'
} as const;
export type LayoutModes = typeof LayoutModes[keyof typeof LayoutModes];
  
export const ThemeModes = {
    LIGHT : 'LIGHT',
    DARK : 'DARK',
    SYSTEM_DEFAULT : 'SYSTEM_DEFAULT'
} as const;
export type ThemeModes = typeof ThemeModes[keyof typeof ThemeModes];