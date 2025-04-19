import {
    Header,
    MainSection,
    SessionTabBar
} from './layout';
import ShortcutHandler from 'pages/ShortcutHandler';
import { ModalProvider } from 'hooks/useModal';

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