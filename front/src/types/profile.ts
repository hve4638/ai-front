export const LayoutModes = {
    VERTICAL : 'vertical',
    HORIZONTAL : 'horizontal'
} as const;
export type LayoutModes = typeof LayoutModes[keyof typeof LayoutModes];
  
export const ThemeModes = {
    LIGHT : 'light',
    DARK : 'dark',
    SYSTEM_DEFAULT : 'system_default'
} as const;
export type ThemeModes = typeof ThemeModes[keyof typeof ThemeModes]; 