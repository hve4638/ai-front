import ThrottleAction from '@/features/throttle-action';
import runtime from '@/runtime';

function globalStorage():IPCInvokerGlobalStorage {
    const throttle = ThrottleAction.getInstance();

    return {
        async get(identifier:string, key:string[]) {
            const accessor = await runtime.globalStorage.accessAsJSON(identifier);
            const value = accessor.get(...key)

            return [null, value];
        },
        async set(identifier:string, data:KeyValueInput) {
            const accessor = await runtime.globalStorage.accessAsJSON(identifier);

            accessor.set(data);
            throttle.saveGlobal();
            return [null];
        },
    }
}

export default globalStorage;