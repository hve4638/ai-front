import { useProfileAPIStore } from '../useProfileAPIStore';

export function makeSetter<FIELDS>(accessorId:string) {
    return <T>(set, name:keyof FIELDS) => {
        return async (value:T) => {
            const { api } = useProfileAPIStore.getState();
        
            await api.set(accessorId, { [name]: value });
            set({ [name]: value });
        }
    }
}

