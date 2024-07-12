import React, { useEffect, useContext, useState} from 'react';
import Home from './pages/Home/Home.tsx'
import './style.js'

import { Initializer, EffectHandler } from './features/stateManagement/index.ts'
import { CleanUp } from './features/stateManagement/CleanUp.tsx';

function App() {
    const [initialized, setInitialized] = useState(false);
    
    return <div id="app" className='fill theme-dark'>
        {
            !initialized &&
            <Initializer
                onLoad={()=>setInitialized(true)}
            />
        }
        {
            initialized &&
            <>
                <Home/>
                <EffectHandler/>
                <CleanUp/>
            </>
        }
    </div>
}
export default App;
