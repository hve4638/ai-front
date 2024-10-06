import { useEffect } from "react";
import LocalAPI from 'api';


export function ExceptionHandler() {
    const handleError = (event)=>{
        LocalAPI.writeLog('error', event.error ? event.error.toString() : 'Unknown error', true);
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