import react from 'react';

export function DebugPage({children}) {
    
    return (
        <div
            className='debug-page column flex'
            style={{
                background: 'grey'
            }}
        >
            <div>
                <h2 style={{color:'white'}}>Debug Page</h2>
            </div>
            <div className='row flex'>
                <div className='column flex'>
                    <h3>IPC API</h3>
                    <button>hi</button>    
                </div>
                <div className='column flex'>
                    
                </div>
            </div>
        </div>
    );
}

