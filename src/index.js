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

reportWebVitals();
//analytics();