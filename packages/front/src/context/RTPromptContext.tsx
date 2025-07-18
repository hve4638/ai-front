import { createContext, useState } from 'react';
import { useParams } from 'react-router';
import { createRTStore, type RTState } from '@/stores/local'

export const PromptStoreContext = createContext<RTState|null>(null); 

export function PromptStoreContextProvider({ children }: { children: React.ReactNode }) {
    const { rtId, promptId } = useParams();
    const [useRTStore] = useState(()=>createRTStore(rtId ?? 'unknown'));
    const store = useRTStore();
    
    return (
        <PromptStoreContext.Provider
            value={store}
        >
            { children }
        </PromptStoreContext.Provider>
    );
};