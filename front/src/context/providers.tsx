import RawProfileContext from './RawProfileContext';
import { EventContextProvider } from './EventContext';
import MemoryContextProvider from './MemoryContext';
import SessionContextProvider from './SessionContext';

export function Providers({children}) {
    return (
        <RawProfileContext
            profile='guest'
        >
            <MemoryContextProvider>
                <SessionContextProvider>
                    <EventContextProvider>
                        {children}
                    </EventContextProvider>
                </SessionContextProvider>
            </MemoryContextProvider>
        </RawProfileContext>
    );
}