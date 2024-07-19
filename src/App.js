import React, { useEffect, useContext, useState} from 'react';
import Home from './pages/Home/Home.tsx'
import './style.js'

import { Initializer, EffectHandler } from './features/stateManagement'
import { CleanUp } from './features/stateManagement/CleanUp';
import { StoreContext } from './context/StoreContext';
import { LayoutModes, ThemeModes } from './data/interface';

function App({historyManager}) {
    const storeContext = useContext(StoreContext);
    if (!storeContext) throw new Error('<App/> required StoreContextProvider');
    
    const [initialized, setInitialized] = useState(false);

    const {
        layoutMode,
        themeMode,
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
                historyManager={historyManager}
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
