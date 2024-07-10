import React, { useEffect, useContext, useState} from 'react';
import './style.js'

import Home from './pages/Home/Home.tsx'
import { PromptContext } from './context/PromptContext.tsx'
import { StateContext } from './context/StateContext.tsx'

import { loadPromptList } from "./services/local/index.ts";


import { PromptList } from './features/prompts/index.ts';

function App() {
    const [initialized, setInitialized] = useState(false);
    const promptContext = useContext(PromptContext);
    const stateContext = useContext(StateContext);
    if (promptContext == null) throw new Error('<App/> required PromptContextProvider');
    if (stateContext == null) throw new Error('<App/> required StateContextProvider');

    useEffect(()=>{
        loadPromptList()
        .then(data => {
            const pl = new PromptList(data);
            promptContext.setPromptList(pl);
            promptContext.setPrompts(data.prompts);
            promptContext.setVars(data.vars);
        })
        .catch(err => {
            console.error(err);
        })
    }, []);
  
    return <div id="app" className='fill theme-dark'>
        {
            !initialized &&
            <Initializer
                onLoad={()=>setInitialized(true)}
            />
        }
        {
            initialized &&
            <Home/>
        }
    </div>
}

function Initializer({ onLoad }) {
    const [promptsLoaded, setPromptsLoaded] = useState(false);
    const [promptKeyLoaded, setPromptKeyLoaded] = useState(false);
    const promptContext = useContext(PromptContext);
    const stateContext = useContext(StateContext);
    if (promptContext == null) throw new Error('<PromptContext/> required PromptContextProvider');
    if (stateContext == null) throw new Error('<StateContext/> required StateContextProvider');

    const {
        setPrompt,
        prompt1Key, prompt2Key,
        setPrompt1Key, setPrompt2Key
    } = stateContext;
    const {
        promptList
    } = promptContext;
    
    useEffect(()=>{
        loadPromptList()
        .then(data => {
            const pl = new PromptList(data);
            promptContext.setPromptList(pl);
            promptContext.setPrompts(data.prompts);
            promptContext.setVars(data.vars);

            setPromptsLoaded(true);
        })
        .catch(err => {
            console.error(err);
            setPromptsLoaded(true);
        })
    }, []);


    useEffect(()=>{
        loadPromptList()
        .then(data => {
            const pl = new PromptList(data);
            promptContext.setPromptList(pl);
            promptContext.setPrompts(data.prompts);
            promptContext.setVars(data.vars);
        })
        .catch(err => {
            console.error(err);
        })
    }, []);

    useEffect(()=>{
        console.log('prompt1Key')
        console.log(prompt1Key)
        if (promptsLoaded && prompt1Key !== null) {
            const [key1, key2] = promptList.findValidPromptKey(prompt1Key, prompt2Key);
            const item = promptList.getPrompt(key1, key2);
            setPrompt1Key(key1);
            setPrompt2Key(key2);
            setPrompt(item);
            onLoad();
        }
    }, [promptsLoaded, prompt1Key])
}

export default App;
