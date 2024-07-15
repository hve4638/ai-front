import React from "react";

interface IconProps {
    style?:any;
}

export function AnthropicIcon({style={}}:IconProps) {
    return (
        <svg style={style} xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em"  viewBox="0 0 256 176">
            <path fill="white" d="m147.487 0l70.081 175.78H256L185.919 0zM66.183 106.221l23.98-61.774l23.98 61.774zM70.07 0L0 175.78h39.18l14.33-36.914h73.308l14.328 36.914h39.179L110.255 0z"/>
        </svg>
    )
}

export function GoogleIcon({style={}}:IconProps) {
    return <svg style={style} xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="currentColor" d="M3.064 7.51A10 10 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9s.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49"/></svg>
}

export function OpenAIIcon({style={}}:IconProps) {
    return <svg style={style} xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em"  viewBox="0 0 24 24"><path fill="currentColor" d="M22.282 9.821a6 6 0 0 0-.516-4.91a6.05 6.05 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a6 6 0 0 0-3.998 2.9a6.05 6.05 0 0 0 .743 7.097a5.98 5.98 0 0 0 .51 4.911a6.05 6.05 0 0 0 6.515 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.772-4.206a6 6 0 0 0 3.997-2.9a6.06 6.06 0 0 0-.747-7.073M13.26 22.43a4.48 4.48 0 0 1-2.876-1.04l.141-.081l4.779-2.758a.8.8 0 0 0 .392-.681v-6.737l2.02 1.168a.07.07 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494M3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085l4.783 2.759a.77.77 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646M2.34 7.896a4.5 4.5 0 0 1 2.366-1.973V11.6a.77.77 0 0 0 .388.677l5.815 3.354l-2.02 1.168a.08.08 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.08.08 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667m2.01-3.023l-.141-.085l-4.774-2.782a.78.78 0 0 0-.785 0L9.409 9.23V6.897a.07.07 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.8.8 0 0 0-.393.681zm1.097-2.365l2.602-1.5l2.607 1.5v2.999l-2.597 1.5l-2.607-1.5Z"/></svg>
}

export function GoogleVertexAIIcon({style={}}:IconProps) {
    return <svg style={style} data-icon-name="vertexSectionIcon" width="1.3em" height="1.3em" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 13.91a.74.74 0 00-1-.16l-6.4 4.72a1.46 1.46 0 01.89 1.22L19.86 15a.75.75 0 00.14-1.09z" opacity=".8"></path><path fill="currentColor" d="M11.43 18.47L5 13.75a.74.74 0 00-1 .16.75.75 0 00.14 1.09l6.4 4.72a1.48 1.48 0 01.89-1.25z"></path><path fill="currentColor" d="M12 18.35a1.47 1.47 0 101.47 1.47A1.47 1.47 0 0012 18.35zm0 2.19a.72.72 0 11.72-.72.72.72 0 01-.72.72z" opacity=".6"></path><path fill="currentColor" d="M6 6.11a.74.74 0 01-.75-.75V3.48a.75.75 0 011.5 0v1.88a.74.74 0 01-.75.75z"></path><circle cx="5.98" cy="12.01" r=".76" fill="currentColor"></circle><circle cx="5.98" cy="9.79" r=".76" fill="currentColor"></circle><circle cx="5.98" cy="7.58" r=".76" fill="currentColor"></circle><g fill="currentColor" opacity=".6"><path d="M18 8.31a.75.75 0 01-.75-.75V5.68a.75.75 0 111.5 0v1.88a.75.75 0 01-.75.75z"></path><circle cx="18.02" cy="12.02" r=".76"></circle><circle cx="18.02" cy="9.77" r=".76"></circle><circle cx="18.02" cy="3.48" r=".76"></circle></g><g fill="currentColor" opacity=".8"><path d="M12 15a.75.75 0 01-.75-.76v-1.89a.75.75 0 011.5 0v1.88A.75.75 0 0112 15z"></path><circle cx="12" cy="16.45" r=".76"></circle><circle cx="12" cy="10.14" r=".76"></circle><circle cx="12" cy="7.93" r=".76"></circle></g><g fill="currentColor" opacity=".6"><path d="M15 10.55a.76.76 0 01-.75-.76V7.91a.75.75 0 011.5 0v1.88a.75.75 0 01-.75.76z"></path><circle cx="15.01" cy="5.7" r=".76"></circle><circle cx="15.01" cy="14.2" r=".76"></circle><circle cx="15.01" cy="11.98" r=".76"></circle></g><circle cx="8.99" cy="14.2" r=".76" fill="currentColor"></circle><circle cx="8.99" cy="7.93" r=".76" fill="currentColor"></circle><circle cx="8.99" cy="5.7" r=".76" fill="currentColor"></circle><path fill="currentColor" d="M9 12.74a.75.75 0 01-.76-.74v-1.9a.75.75 0 011.5 0V12a.76.76 0 01-.74.74z"></path></svg>
}