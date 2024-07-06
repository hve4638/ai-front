import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import analytics from './analytics.ts';
import reportWebVitals from './reportWebVitals';

import { CookiesProvider } from 'react-cookie';
import APIContextProvider from './context/APIContext.tsx'
import PromptContextProvider from './context/PromptContext.tsx'
import StateContextProvider from './context/StateContext.tsx'
import DebugContextProvider from './context/DebugContext.tsx'
import {TARGET_ENV} from './data/constants.tsx'


if (TARGET_ENV == "WEB" || TARGET_ENV == "WINDOWS") {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <CookiesProvider>
    <APIContextProvider>
    <PromptContextProvider>
    <StateContextProvider>
    <DebugContextProvider>
      <App/>
    </DebugContextProvider>
    </StateContextProvider>
    </PromptContextProvider>
    </APIContextProvider>
    </CookiesProvider>
  );
}
else {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(`Invalid TARGET_ENV : '${TARGET_ENV}'`);
}


reportWebVitals();
//analytics();