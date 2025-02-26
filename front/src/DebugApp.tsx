import { useEffect, useState } from 'react'
import LocalAPI from 'api/local';

function DebugApp() {
    return (
        <div
            className={
                'fill'
            }
            style={{
                fontSize: '18px',
                display: 'block'
            }}
        >
            <h2>TEST PAGE</h2>
            <div>1. </div>
            <div>2. </div>
            <div>
                <button>RUN</button>
            </div>
        </div>
    )
}

export default DebugApp;
