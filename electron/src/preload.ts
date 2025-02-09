import { contextBridge, ipcRenderer } from 'electron';
import { IPCCommand } from '@types';

const ipcExports = Object.fromEntries(
    Object.entries(IPCCommand).map(
        ([_, ping]) => [
            ping,
            (...args: unknown[]) => ipcRenderer.invoke(ping, ...args)
        ]
    )
);

contextBridge.exposeInMainWorld('electron', ipcExports); 