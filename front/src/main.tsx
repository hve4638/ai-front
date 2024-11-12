import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Providers } from './context'
import App from './App.tsx'
import './index.css'
import 'assets/style/base.scss'
import 'assets/style/main.scss'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Providers>
            <App/>
        </Providers>
    </StrictMode>,
)
