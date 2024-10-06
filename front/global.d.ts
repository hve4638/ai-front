import '../shared/ipctype.d.ts';

declare global {
    interface Window {
        electron: IPC_TYPES;
    }

    declare module '*.png' {
        const value: string;
        export default value;
    }
    
    declare module '*.jpg' {
        const value: string;
        export default value;
    }
    
    declare module '*.jpeg' {
        const value: string;
        export default value;
    }
    
    declare module '*.svg' {
        const value: string;
        export default value;
    }
}