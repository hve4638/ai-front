import {
    Header,
    IOSection,
    SessionTabBar
} from './layout';
import ShortcutHandler from 'pages/ShortcutHandler';
import { ModalProvider } from 'hooks/useModal';
import ErrorToastSection from './ErrorToastSection';
import ToastAnchor from '@/components/ToastAnchor';
import { Grid } from '@/components/layout';
import ToastRenderer from '@/components/ToastAnchor/ToastRenderer';

function HomePage() {
    return (
        <ModalProvider>
            <Grid
                id='home'
                className='column relative'
                rows='40px 1fr 32px'
                columns='1fr'
                style={{
                    width: '100vw',
                    height: '100vh',
                }}
            >
                <Header />
                <IOSection />
                <SessionTabBar />
            </Grid>
            <ToastRenderer
                top='40px'
                right='0'
            />
            <ShortcutHandler />
        </ModalProvider>
    );
}

export default HomePage;