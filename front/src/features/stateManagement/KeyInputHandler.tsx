import { useContext, useEffect, useState } from 'react'
import {
    StoreContext,
    MemoryContext,
    EventContext,
    SecretContext,
    useContextForce
} from 'context'

const ANY:any = {};

export function KeyInputHandler() {
    const storeContext = useContextForce(StoreContext);
    const memoryContext = useContextForce(MemoryContext);
    const eventContext = useContextForce(EventContext);

    const [changeSessionTabPing, setChangeSessionTabPing] = useState(0);
    const [changeSessionMovePing, setChangeSessionMovePing] = useState<number|null>(null);
    const [wheelPing, setWheelPing] = useState(0);

    const {
        sessions,
        fontSize,
    } = storeContext;

    // Ctrl+숫자 핑
    useEffect(()=>{
        if (changeSessionMovePing == null) return;
        
        const index = changeSessionMovePing - 1;
        if (index < sessions.length) {
            const nextSession = sessions[index];
            eventContext.changeCurrentSession(nextSession);
        }

        setChangeSessionMovePing(null);
    }, [changeSessionMovePing])

    // Ctrl+Tab 핑
    useEffect(()=>{
        if (changeSessionTabPing === 0) {
            return;
        }
        
        if (sessions.length >= 2) {
            for (let i in sessions) {
                const session = sessions[i];
                if (session.id === memoryContext.currentSession.id) {
                    let nextIndex = Number(i);
                    if (changeSessionTabPing > 0) nextIndex++;
                    else nextIndex--;
                    if (nextIndex < 0) nextIndex += sessions.length;
                    nextIndex %= sessions.length;

                    const nextSession = sessions[nextIndex];
                    eventContext.changeCurrentSession(nextSession);
                    setChangeSessionTabPing(0);
                }
            }
        }
    }, [changeSessionTabPing])

    // Ctrl+Wheel 핑
    useEffect(()=>{
        if (wheelPing === 0) return;

        const rootElement = document.querySelector('html');
        if (rootElement != null) {
            let num;
            num = fontSize+wheelPing;
            rootElement.style.fontSize = `${num}px`;
            storeContext.setFontSize(num);
            setWheelPing(0);
        }
    }, [wheelPing])

    // 단축키 핸들링
    useEffect(()=>{
        const handleKeyDown = (event) => {
            if (event.ctrlKey) {
                if (event.key === 'Tab') {
                    if (event.shiftKey) {
                        setChangeSessionTabPing((ping)=>ping-1);
                    }
                    else {
                        setChangeSessionTabPing((ping)=>ping+1);
                    }
                    event.preventDefault();
                }
                else if (event.key === 'Enter') {
                    memoryContext.setApiSubmitPing(true);
                    event.preventDefault();
                }
                else {
                    for (let i = 1; i < 10; i++) {
                        if (event.key === String(i)) {
                            setChangeSessionMovePing(i);
                            event.preventDefault();
                        }
                    }
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // 휠 핸들링
    useEffect(()=>{
        const handleWheel = (event)=>{
            if (event.ctrlKey) {
                setWheelPing(ping=>ping-Math.sign(event.deltaY))
                event.preventDefault();
            }
        }

        document.addEventListener('wheel', handleWheel, {passive:false});
        return () => {
          window.removeEventListener('wheel', handleWheel);
        };
    }, []);
}