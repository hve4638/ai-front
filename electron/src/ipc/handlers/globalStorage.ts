import { globalStorage } from '@ipc/registry';
import { IPCCommand } from 'types';

function handler() {
    return {
        [IPCCommand.GetGlobalData] : async (identifier:string, key:string[]) => {
            const accessor = globalStorage.getJSONAccessor(identifier);

            return [null, accessor.get(key)] as const;
        },
        [IPCCommand.SetGlobalData] : async (identifier:string, data:KeyValueInput) => {
            const accessor = globalStorage.getJSONAccessor(identifier);

            accessor.set(data);
            return [null] as const;
        },
    }
}

export default handler;