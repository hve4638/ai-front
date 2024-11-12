import RawProfileContext from './RawProfileContext';
// import MemoryContextProvider from './MemoryContext';
//import SessionContextProvider from './SessionContext';

export function Providers({children}) {
    return (
        <RawProfileContext>
            {/* <MemoryContextProvider> */}
                {/* <SessionContextProvider> */}
                    {/* <EventContextProvider> */}
                        {children}
                    {/* </EventContextProvider> */}
                {/* </SessionContextProvider> */}
            {/* </MemoryContextProvider> */}
        </RawProfileContext>
    );
}