import runtime from '@/runtime';
import { IPCInvokerName } from 'types';

function handler() {
    return {
        [IPCInvokerName.GetGlobalData] : async (identifier:string, key:string[]) => {
            const accessor = await runtime.globalStorage.accessAsJSON(identifier);

            return [null, accessor.get(...key)] as const;
        },
        [IPCInvokerName.SetGlobalData] : async (identifier:string, data:KeyValueInput) => {
            const accessor = await runtime.globalStorage.accessAsJSON(identifier);

            accessor.set(data);
            return [null] as const;
        },
    }
}

export default handler;