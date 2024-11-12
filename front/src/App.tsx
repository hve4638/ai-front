import { useState } from 'react'
import { useContextForce, RawProfileContext } from 'context'
import { LayoutModes } from 'types/profile'

import ProfileSelectPage from 'pages/ProfileSelect';
import './App.css'

function App() {
    const rawProfileContext = useContextForce(RawProfileContext);
    const {
        profileName,
        layoutMode,
    } = rawProfileContext;

    const [initialized, setInitialized] = useState(false);

    return (
        <div
            className={
                'theme-dark'
                + (layoutMode == LayoutModes.AUTO ? ' layout-auto' : '')
                + (layoutMode == LayoutModes.HORIZONTAL ? ' layout-horizontal' : '')
                + (layoutMode == LayoutModes.VERTICAL ? ' layout-vertical' : '')
            }
        >
            {
                profileName == null &&
                <ProfileSelectPage></ProfileSelectPage>
            }
            {
                initialized &&
                <>
                    {/* <Home/> */}
                </>
            }
        </div>
    )
}

export default App
