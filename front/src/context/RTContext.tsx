import { createContext, useState } from 'react';
import { useParams } from 'react-router';
import { createRTStore, type RTState } from '@/stores/local'

export const RTStoreContext = createContext<RTState|null>(null); 

export function RTStoreContextProvider({ children }: { children: React.ReactNode }) {
    const { rtId } = useParams();
    const [useRTStore] = useState(()=>createRTStore(rtId ?? 'unknown'));
    const store = useRTStore();
    return (
        <RTStoreContext.Provider
            value={store}
        >
            { children }
        </RTStoreContext.Provider>
    );
};