import { useEffect, useState } from 'react';
import './Load.scss';

interface LoadPageProps {

}

function LoadPage({

}:LoadPageProps) {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setFadeIn(true);
        }, 1000);
    }, []);

    return (
        <div className='loading-page undraggable'>
            <div className='row' style={{padding:'16px', alignItems: 'center'}}>
                {/* <span className='loader-text'>loading...</span> */}
                <div className={`loading-circle ${fadeIn ? 'fade-in' : 'fade-in-ready'}`}/>
            </div>
        </div>
    )
}

export default LoadPage;