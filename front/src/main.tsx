import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Providers } from './context'
import App from './App.tsx'
import './index.css'
import 'assets/style/index.scss'

console.log("!@#@$!")

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)
