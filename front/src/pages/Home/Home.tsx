import { useState } from 'react';
import { RawProfileSessionContextProvider } from 'context/RawProfileSessionContext';
import Header from './Header';
import SessionTabBar from './SessionTabBar';
import MainSection from './MainSection';
import SettingModal from '../SettingModal';
import ShortcutHandler from 'pages/ShortcutHandler';

function HomePage() {
    const [enableModal, setEnableModal] = useState(false);

    return (
        <div
            id='home'
            className='column relative'
        >
            <RawProfileSessionContextProvider>
                <Header
                    onEnableSetting={()=>setEnableModal(true)}
                />
                <MainSection/>
                
                {
                    enableModal &&
                    <SettingModal
                        onClose={()=>setEnableModal(false)}
                    />
                }
            </RawProfileSessionContextProvider>
            <SessionTabBar/>
            
            <ShortcutHandler/>
        </div>
    );
}

export default HomePage;