import '@shared/ipctype.d.ts';

declare global {
    interface Window {
        electron: IPCInterface;
    }
}