import { globalStorage } from '@/registry';
import { IPCInvokerName } from 'types';

function handler() {
    return {
        [IPCInvokerName.GetGlobalData] : async (identifier:string, key:string[]) => {
            const accessor = await globalStorage.accessAsJSON(identifier);

            return [null, accessor.get(...key)] as const;
        },
        [IPCInvokerName.SetGlobalData] : async (identifier:string, data:KeyValueInput) => {
            const accessor = await globalStorage.accessAsJSON(identifier);

            accessor.set(data);
            return [null] as const;
        },
    }
}

export default handler;