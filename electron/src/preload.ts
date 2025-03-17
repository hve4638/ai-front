import { contextBridge, ipcRenderer } from 'electron';
import { IPCInvokerName } from 'types';

const ipcExports = Object.fromEntries(
    Object.entries(IPCInvokerName).map(
        ([_, ping]) => [
            ping,
            (...args: any) => ipcRenderer.invoke(ping, ...args)
        ]
    )
);

contextBridge.exposeInMainWorld('electron', ipcExports);