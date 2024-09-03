import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
//import analytics from './analytics.ts';
import reportWebVitals from './reportWebVitals';

import { CookiesProvider } from 'react-cookie';
import SecretContextProvider from './context/SecretContext'
import PromptContextProvider from './context/PromptContext'
import StoreContextProvider from './context/StoreContext'
import DebugContextProvider from './context/DebugContext'
import MemoryContextProvider from './context/MemoryContext'
import {EventContextProvider} from './context/EventContext'
import {TARGET_ENV} from './data/constants.tsx'

import { HistoryManager } from './features/historyManager';

const historyManager = new HistoryManager();

if (TARGET_ENV === "WEB" || TARGET_ENV === "WINDOWS") {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <CookiesProvider>
      <SecretContextProvider>
          <StoreContextProvider>
            <MemoryContextProvider>
              <EventContextProvider>
                <DebugContextProvider>
                  <App
                    historyManager={historyManager}
                  />
                </DebugContextProvider>
              </EventContextProvider>
            </MemoryContextProvider>
          </StoreContextProvider>
      </SecretContextProvider>
    </CookiesProvider>
  );
}
else {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(`Invalid TARGET_ENV : '${TARGET_ENV}'`);
}


reportWebVitals();
//analytics();