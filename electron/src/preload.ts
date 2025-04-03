import { contextBridge, ipcRenderer } from 'electron';
import { IPCInvokerName, IPCListenerName } from 'types';
import { IPCListenerPing } from './data';

let bindId = 0;
const bindedListener = new Map<number, any>();

const ipcExports:IPCInterface = {
    ...Object.fromEntries(
        Object.entries(IPCInvokerName).map(
            ([_, ping]) => [
                ping,
                (...args: any) => ipcRenderer.invoke(ping, ...args)
            ]
        )
    ) as IPCInvokeIntrerface,
    [IPCListenerName.AddRequestListener] : async (listener) => {
        const index = bindId++;
        bindedListener[index] = listener;

        ipcRenderer.on(IPCListenerPing.Request, listener);
        return [null, index] as const;
    },
    [IPCListenerName.RemoveRequestListener] : async (bindId:number) => {
        const binded = bindedListener[bindId];
        if (binded) {
            ipcRenderer.off(IPCListenerPing.Request, binded);
        }
        return [null] as const;
    },
}

contextBridge.exposeInMainWorld('electron', ipcExports);