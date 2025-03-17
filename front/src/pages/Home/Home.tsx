import { ReactElement, useCallback, useState } from 'react';
import Header from './layout/Header';
import SessionTabBar from './SessionTabBar';
import MainSection from './layout/MainSection';
import SettingModal from '../../modals/SettingModal';
import ShortcutHandler from 'pages/ShortcutHandler';
import { ModalProvider } from 'hooks/useModals';

function HomePage() {
    return (
        <ModalProvider>
            <div
                id='home'
                className='column relative'
            >
                <Header/>
                <MainSection/>
                <SessionTabBar/>
                <ShortcutHandler/>
            </div>
        </ModalProvider>
    );
}

export default HomePage;