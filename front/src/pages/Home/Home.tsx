import { useState } from 'react';
import { RawProfileSessionContextProvider } from 'context/RawProfileSessionContext';
import Header from './Header';
import SessionTabBar from './SessionTabBar';
import MainSection from './MainSection';
import SettingModal from '../SettingModal';
import ShortcutHandler from 'pages/ShortcutHandler';
import PromptEditor from 'pages/PromptEditor';
import { PageType } from './types';

function HomePage() {
    const [showSettingModal, setShowSettingModal] = useState(false);
    const [pageType, setPageType] = useState<PageType>(PageType.HOME);
    
    return (
    <div
        id='home'
        className='column relative'
    >
        <RawProfileSessionContextProvider>
            {
                pageType === PageType.HOME &&
                <>
                    <Header
                        onEnableSetting={()=>setShowSettingModal(true)}
                        onChangePage={(pageType)=>setPageType(pageType)}
                    />
                    <MainSection/>
                    <SessionTabBar/>
                    <ShortcutHandler/>
                </>
            }
            {
                pageType === PageType.PROMPT_EDITOR &&
                <PromptEditor
                    mode={'NEW'}
                />
            }
            
            {
                showSettingModal &&
                <SettingModal
                    onClose={()=>setShowSettingModal(false)}
                />
            }
        </RawProfileSessionContextProvider>
    </div>
    );
}

export default HomePage;