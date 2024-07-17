import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import analytics from './analytics.ts';
import reportWebVitals from './reportWebVitals';

import { CookiesProvider } from 'react-cookie';
import SecretContextProvider from './context/SecretContext.tsx'
import PromptContextProvider from './context/PromptContext.tsx'
import StoreContextProvider from './context/StoreContext.tsx'
import DebugContextProvider from './context/DebugContext.tsx'
import MemoryContextProvider from './context/MemoryContext.tsx'
import {EventContextProvider} from './context/EventContext.tsx'
import {TARGET_ENV} from './data/constants.tsx'

import { HistoryManager } from './features/historyManager/index.ts';

const historyManager = new HistoryManager();

if (TARGET_ENV == "WEB" || TARGET_ENV == "WINDOWS") {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <CookiesProvider>
      <SecretContextProvider>
        <PromptContextProvider>
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
        </PromptContextProvider>
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