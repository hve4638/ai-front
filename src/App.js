import React, { useEffect, useContext, useState} from 'react';
import Home from './pages/Home/Home.tsx'
import './style.js'

import { Initializer, EffectHandler } from './features/stateManagement/index.ts'
import { CleanUp } from './features/stateManagement/CleanUp.tsx';
import { StoreContext } from './context/StoreContext.tsx';
import { LayoutModes } from './data/interface.ts';

function App() {
    const storeContext = useContext(StoreContext);
    if (!storeContext) throw new Error('<App/> required StoreContextProvider');

    const [initialized, setInitialized] = useState(false);

    const {
        layoutMode
    } = storeContext;
    
    return (
        <div
            id="app"
            className={
                'theme-dark'
                + (layoutMode==LayoutModes.AUTO ? ' layout-auto' : '')
                + (layoutMode==LayoutModes.HORIZONTAL ? ' layout-horizontal' : '')
                + (layoutMode==LayoutModes.VERTICAL ? ' layout-vertical' : '')
            }
        >
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
    )
}
export default App;
