import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
//import analytics from './analytics.ts';
import reportWebVitals from './reportWebVitals';

import DebugPage from 'pages/DebugPage';

import SecretContextProvider from './context/SecretContext'
import StoreContextProvider from './context/StoreContext'
import DebugContextProvider from './context/DebugContext'
import MemoryContextProvider from './context/MemoryContext'
import { CookiesProvider } from 'react-cookie';
import { EventContextProvider } from './context/EventContext'
import { TARGET_ENV, DEBUG_MODE } from './data/constants'

import { HistoryManager } from './features/historyManager';

const historyManager = new HistoryManager();

if (TARGET_ENV === "WEB" || TARGET_ENV === "WINDOWS") {
    if (DEBUG_MODE) {
        console.log('DEBUG_MODE');
        const root = ReactDOM.createRoot(document.getElementById('root'));
        
        root.render(
            <DebugPage>
                {/* <CookiesProvider>
                    <SecretContextProvider>
                        <StoreContextProvider>
                            <MemoryContextProvider>
                                <EventContextProvider>
                                    <App
                                        historyManager={historyManager}
                                    />
                                </EventContextProvider>
                            </MemoryContextProvider>
                        </StoreContextProvider>
                    </SecretContextProvider>
                </CookiesProvider> */}
            </DebugPage>
        );
    }
    else {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        
        root.render(
            <CookiesProvider>
                <SecretContextProvider>
                    <StoreContextProvider>
                        <MemoryContextProvider>
                            <EventContextProvider>
                                <App
                                    historyManager={historyManager}
                                />
                            </EventContextProvider>
                        </MemoryContextProvider>
                    </StoreContextProvider>
                </SecretContextProvider>
            </CookiesProvider>
        );
    }
}
else {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(`Invalid Enviorment : '${TARGET_ENV}'`);
}


reportWebVitals();
//analytics();