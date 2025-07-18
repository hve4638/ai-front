export type IIPCAPI = {
    [KEY in keyof IPCInvokerInterface]: {
        [KEY2 in keyof IPCInvokerInterface[KEY]]: Function
    }
} & {
    [KEY in keyof IPCListenerInterface]: {
        [KEY2 in keyof IPCListenerInterface[KEY]]: Function
    }
}
