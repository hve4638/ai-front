import React, { useContext, useEffect, useState } from 'react'
import GithubIcon from 'assets/icons/github.png'
import { DOWNLOAD_LINK, GITHUB_LINK, TARGET_ENV, VERSION } from 'data/constants';

import { LocalInteractive } from 'services/local';
import { SessionSlot, SessionSlotAdder } from 'features/chatSession';

import {
    useContextForce,
    StoreContext,
    DebugContext,
    MemoryContext,
    EventContext
} from 'context';

import { GoogleFontIconButton } from 'components/GoogleFontIcon.tsx';
import { HoverTooltip } from 'components/HoverTooltip.tsx';

interface FooterProps {
    onOpenDebug:()=>void
}

export default function Footer({ onOpenDebug }:FooterProps) {
    const [existsNewVersion, setExistsNewVersion] = useState(false);
    const storeContext = useContextForce(StoreContext);
    const memoryContext = useContextForce(MemoryContext);
    const debugContext = useContextForce(DebugContext);
    const eventContext = useContextForce(EventContext);
    
    const {
        sessions,
        markdownMode, setMarkdownMode,
        lineByLineMode, setLineByLineMode
    } = storeContext;
    const {
        currentSession,
    } = memoryContext;
    const {
        createSession,
        deleteSession,
        changeCurrentSession,
    } = eventContext;
    
    const onSessionChange = (session) => {
        if (currentSession.id === session.id) {
            memoryContext.setCurrentSession(session);
        }
        else {
            for (const i in sessions) {
                if (sessions[i].id === session.id) {
                    const newSessions = [...sessions];
                    newSessions[i] = session;
                    storeContext.setSessions(newSessions);
                    break;
                }
            }
        }
    }

    useEffect(()=>{
        LocalInteractive.isNewVersionAvailable()
        .then(data=>{
            if (data) {
                setExistsNewVersion(true);
            }
        })
    }, []);
    
    return (
    <footer id='app-footer' className='noflex row'>
        <div className='expand-section row main-spacebetween undraggable'>
            <div className='noflex'>
                <img
                    className='browse-button'
                    src={GithubIcon}
                    alt='github-icon'
                    onClick={()=> LocalInteractive.openBrowser(GITHUB_LINK)}
                />
                <div className='noflex'>
                    <div className='footer-version-container column'>
                        {
                            existsNewVersion &&
                            <div
                                className='noflex footer-newversion-text clickable'
                                onClick={()=>LocalInteractive.openBrowser(DOWNLOAD_LINK)}
                            >
                                New version available!
                            </div>
                        }
                        <div className='flex'/>
                        <div className='footer-version'>{VERSION}</div>
                    </div>
                </div>
            </div>
            <div className='flex row main-end'>
                {
                    sessions != null &&
                    [...sessions].map((session, index) => (
                        <SessionSlot
                            key={index}
                            session={session}
                            index={index+1}
                            selected={session.id===currentSession.id}
                            onClick={()=>changeCurrentSession(session)}
                            onSessionChange={(data)=>onSessionChange(data)}
                            onDelete={()=>deleteSession(session)}
                        />
                    ))
                }
                <SessionSlotAdder
                    onClick={()=>createSession()}
                />
            </div>
        </div>
        <div className='seperate-section'/>
        <div className='expand-section'>
            <HoverTooltip
                text="마크다운"
            >
                <GoogleFontIconButton
                    value='markdown'
                    selected={markdownMode}
                    onClick={()=>setMarkdownMode(!markdownMode)}
                />
            </HoverTooltip>
            <FooterPad/>
            <HoverTooltip
                text="XML (실험적)"
            >
                <GoogleFontIconButton
                    value='code'
                    selected={lineByLineMode}
                    onClick={()=>setLineByLineMode(!lineByLineMode)}
                />
            </HoverTooltip>
            <div className='flex'></div>
            {
                debugContext.isDebugMode &&      
                <GoogleFontIconButton
                    value='screen_share'
                    selected={debugContext.mirror}
                    onClick={()=>debugContext.setMirror(!debugContext.mirror)}
                />
            }
            <FooterPad/>
            {
                debugContext.isDebugMode &&
                <GoogleFontIconButton
                    value='labs'
                    onClick={()=>onOpenDebug()}
                />
            }
            {
                TARGET_ENV !== "WEB" &&
                <>
                    <FooterPad/>
                    <GoogleFontIconButton
                        className='font-icon'
                        value='folder_open'
                        onClick={()=>LocalInteractive.openPromptDirectory()}
                    />
                </>
            }
        </div>
    </footer>
    );
}

const FooterPad = () => (<div className='footer-pad'/>)

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
