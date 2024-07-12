import React, { useContext, useEffect, useState } from 'react'
import { DOWNLOAD_LINK, GITHUB_LINK, TARGET_ENV, VERSION } from '../../data/constants.tsx';
import GithubIcon from '../../assets/icons/github.png'

import { StoreContext } from "../../context/StoreContext.tsx";
import { DebugContext } from '../../context/DebugContext.tsx';
import { isNewVersionAvailable, openBrowser, openPromptFolder } from '../../services/local/index.ts';

import { HoverTooltip } from '../../components/HoverTooltip.tsx';
import { PromptContext } from '../../context/PromptContext.tsx';
import { SessionSlot, SessionSlotAdder } from '../../features/chatSession/index.ts';
import { MemoryContext } from '../../context/MemoryContext.tsx';
import { EventContext } from '../../context/EventContext.tsx';

interface FooterProps {
    onOpenDebug:()=>void
}

export default function Footer({ onOpenDebug }:FooterProps) {
    const [existsNewVersion, setExistsNewVersion] = useState(false);
    const promptContext = useContext(PromptContext);
    const storeContext = useContext(StoreContext);
    const memoryContext = useContext(MemoryContext);
    const debugContext = useContext(DebugContext);
    const eventContext = useContext(EventContext);
    if (!promptContext) throw new Error('Footer must be used in StoreContextProvider');
    if (!storeContext) throw new Error('Footer must be used in StoreContextProvider');
    if (!debugContext) throw new Error('Footer must be used in DebugContextProvider');
    if (!memoryContext) throw new Error('Footer must be used in MemoryContextProvider');
    if (!eventContext) throw new Error('Footer must be used in EventContextProvider');
    const {
        sessions, setSessions,
        currentSessionId, setCurrentSessionId,
        markdownMode, setMarkdownMode,
        lineByLineMode, setLineByLineMode
    } = storeContext;
    const {
        promptList
    } = promptContext;
    const {
        currentSession,
        nextSessionID,
        setNextSessionID,
        setCurrentSession,
    } = memoryContext;
    const {
        createSession,
        deleteSession,
        changeCurrentSession,
        commitCurrentSession,
    } = eventContext;
    
    const onSessionChange = (session) => {
        if (currentSession.id === session.id) {
            setCurrentSession(session);
        }
        else {
            for (const i in sessions) {
                if (sessions[i].id === session.id) {
                    const newSessions = [...sessions];
                    newSessions[i] = session;
                    setSessions(newSessions);
                    break;
                }
            }
        }
    }

    useEffect(()=>{
        isNewVersionAvailable()
        .then(data=>{
            if (data) {
                setExistsNewVersion(true);
            }
        })
    }, []);
    
    return (
    <footer className='noflex row'>
        <div className='left-section'>
            <div className='noflex footer-icon undraggable' style={{ height: '35px' }}>
                <img
                    alt='github-icon'
                    className='clickable-animation'
                    src={GithubIcon}
                    onClick={()=> openBrowser(GITHUB_LINK)}
                />
                <div className='noflex hfill column footer-version-container'>
                    {
                        existsNewVersion &&
                        <div
                            className='noflex update-message clickable'
                            onClick={()=>openBrowser(DOWNLOAD_LINK)}
                        >
                            New version available!
                        </div>
                    }
                    <div className='flex'/>
                    <div className='footer-version'>{VERSION}</div>
                </div>
            </div>
            <div className='flex prompt-slots-container row-reverse undraggable'>
                <SessionSlotAdder
                    onClick={()=>createSession()}
                />
                {
                    sessions != null &&
                    [...sessions].reverse().map((session, index) => (
                        <SessionSlot
                            key={index}
                            session={session}
                            index={sessions.length - index}
                            selected={session.id===currentSession.id}
                            onClick={()=>changeCurrentSession(session)}
                            onSessionChange={(data)=>onSessionChange(data)}
                            onDelete={()=>deleteSession(session)}
                        />
                    ))
                }
            </div>
        </div>
        <div className='seprate-section'>
        </div>
        <div className='right-section'>
            <div style={{width:'16px'}}/>
            <HoverTooltip
                text="마크다운"
            >
                <IconButton
                    value='markdown'
                    enabled={markdownMode}
                    size={30}
                    onClick={()=>setMarkdownMode(!markdownMode)}
                />
            </HoverTooltip>
            <Pad/>
            <HoverTooltip
                text="XML (실험적)"
            >
                <IconButton
                    value='code'
                    enabled={lineByLineMode}
                    size={30}
                    onClick={()=>setLineByLineMode(!lineByLineMode)}
                />
            </HoverTooltip>
            <div className='flex'></div>
            {
                debugContext.isDebugMode &&      
                <IconButton
                    value='screen_share'
                    enabled={debugContext.mirror}
                    size={30}
                    onClick={()=>debugContext.setMirror(!debugContext.mirror)}
                />
            }
            <Pad/>
            {
                debugContext.isDebugMode &&
                <IconButton
                    value='labs'
                    size={30}
                    onClick={()=>onOpenDebug()}
                />
            }
            {
                TARGET_ENV !== "WEB" &&
                <>
                    <Pad/>
                    <IconButton
                        value='folder_open'
                        size={30}
                        onClick={()=>openPromptFolder()}
                    />
                </>
            }
            <div style={{width:'16px'}}/>
        </div>
    </footer>
    );
}

const Pad = () => (<div style={{width:'8px'}}/>)

interface IconButtonProps {
    className?:string;
    value:string;
    size:number;
    enabled?:boolean;
    onClick:()=>void;
}
function IconButton({
    className='', value, size, enabled=false, onClick
}:IconButtonProps) {
    const pxsize = `${size}px`;
    return (
        <label
            className={`${className} span-button-container undraggable center`}
            style={{ color: 'white', fontSize: pxsize, width: pxsize, height: pxsize }}
            onClick={(e)=>onClick()}
        >
            <span className={`${enabled ? 'selected' : ''} material-symbols-outlined span-button`}>
                {value}
            </span>
        </label>
    )
}
