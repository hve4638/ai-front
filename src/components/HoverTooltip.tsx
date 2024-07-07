import React, { useEffect } from "react";
import { useState } from "react";
import ReactDOM from "react-dom";

export function HoverTooltip({ children, text }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    const [showTooltip, setShowTooltip] = useState(false);
    const [isHover, setIsHover] = useState(false);

    useEffect(()=>{
        let timeout;
        if (isHover) {
            timeout = setTimeout(()=>{
                setShowTooltip(true);
            }, 500);
        }
        else {
            setShowTooltip(false);
        }

        return () => {
            clearInterval(timeout);
        }
    },[isHover]);

    return (
        <>
            <div
                onMouseEnter={()=>setIsHover(true)}
                onMouseLeave={()=>setIsHover(false)}
                onMouseMove={handleMouseMove}
            >
                {children}
            </div>
            {
                showTooltip &&
                ReactDOM.createPortal(
                    <div className="hover-tooltip" style={{left:position.x + 5, top:position.y-25}}>
                        {text}
                    </div>
                ,document.querySelector('#app') ?? document.body)
            }
        </>
    )
}