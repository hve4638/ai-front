import React, {useState, useEffect} from 'react';
import './style.js'
import APIContextProvider from './context/APIContext.tsx'
import PromptContextProvider from './context/PromptContext.tsx'
import StateContextProvider from './context/StateContext.tsx'
import DebugContextProvider from './context/DebugContext.tsx'

import Home from './pages/Home/Home.tsx'

function App() {
  return <div className='fill column'>
    <APIContextProvider>
    <PromptContextProvider>
    <StateContextProvider>
    <DebugContextProvider>
      <Home></Home>
    </DebugContextProvider>
    </StateContextProvider>
    </PromptContextProvider>
    </APIContextProvider>
  </div>
}

export default App;
