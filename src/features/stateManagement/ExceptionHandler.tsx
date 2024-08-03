import { useEffect } from "react";



export function ExceptionHandler() {
    const handleError = (event)=>{
        window.electron.logError(event.error ? event.error.toString() : 'Unknown error');
    }

    useEffect(()=>{
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleError);

        return ()=>{
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleError);
        }
    })
}