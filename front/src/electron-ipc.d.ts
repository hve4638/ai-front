import '@shared/ipctype.d.ts';

declare global {
    interface Window {
        electron: IPC_TYPES;
    }
}