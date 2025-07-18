export const IPCListenerPing = {
    Request : 'request',
} as const;
export type IPCListenerPing = typeof IPCListenerPing[keyof typeof IPCListenerPing];