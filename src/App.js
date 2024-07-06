import React, { useEffect, useContext} from 'react';
import './style.js'

import Home from './pages/Home/Home.tsx'
import { PromptContext } from './context/PromptContext.tsx'
import { StateContext } from './context/StateContext.tsx'
import { requestPromptlist } from "./services/local.ts";
import { PromptList } from './features/prompts/index.ts';

function App() {
    const promptContext = useContext(PromptContext);
    const stateContext = useContext(StateContext);
    if (promptContext == null) throw new Error('<App/> required PromptContextProvider');
    if (stateContext == null) throw new Error('<App/> required StateContextProvider');

    const {
        setPrompt,
        prompt1Key, prompt2Key,
        setPrompt1Key, setPrompt2Key
    } = stateContext;

    useEffect(()=>{
        requestPromptlist()
        .then(data => {
            const pl = new PromptList(data);
            promptContext.setPromptList(pl);
            promptContext.setPrompts(data.prompts);
            promptContext.setVars(data.vars);

            const [key1, key2] = pl.findValidPromptKey(prompt1Key, prompt2Key);
            const item = pl.getPrompt(key1, key2);
            setPrompt1Key(key1);
            setPrompt2Key(key2);
            setPrompt(item);
        });
    }, []);
  
    return <div id="app" className='fill theme-dark'>
        <Home></Home>
    </div>
}

export default App;
