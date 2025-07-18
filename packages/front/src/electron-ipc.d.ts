import '@shared/types.d.ts';

declare global {
    interface Window {
        electron: IPCInterface;
    }
}