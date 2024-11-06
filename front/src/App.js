import React, { useEffect, useContext, useState} from 'react';
import Home from './pages/Home/Home.tsx'
import './style.js'

import { Initializer, EffectHandler, KeyInputHandler } from './features/stateManagement/index.ts'
import { CleanUp } from './features/stateManagement/CleanUp.tsx';
import { StoreContext } from './context';
import { LayoutModes, ThemeModes } from './data/interface.ts';
import { ExceptionHandler } from 'features/stateManagement/ExceptionHandler.tsx';
import { useContextForce } from 'context';
import { LoadFailPage } from 'pages/LoadFail/LoadFailPage.tsx';

function App({historyManager}) {
    const storeContext = useContextForce(StoreContext);
    
    const [initialized, setInitialized] = useState(false);
    const [initializeFailed, setInitializeFailed] = useState(false);
    const [failReason, setFailReason] = useState('Error!');
    const [failReasonDetail, setFailReasonDetail] = useState('1234');

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
            initializeFailed &&
            <LoadFailPage
                failReason={failReason}
                failReasonDetail={failReasonDetail}
            />
        }
        {
            !initializeFailed && !initialized &&
            <Initializer
                onLoad={()=>setInitialized(true)}
                onLoadFail={
                    (reason, detail) => {
                        setInitializeFailed(true);
                        setFailReason(reason);
                        setFailReasonDetail(detail);
                    }
                }
                historyManager={historyManager}
            />
        }
        {
            initialized &&
            <>
                <Home/>
                <EffectHandler/>
                <KeyInputHandler/>
                <CleanUp/>
            </>
        }
        </div>
    )
}

export default App;
