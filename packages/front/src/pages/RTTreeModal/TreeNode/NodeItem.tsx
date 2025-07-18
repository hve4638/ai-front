import { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { TreeNodeProps, Regions } from './types';
import styles from './styles.module.scss';


export function NodeItem({
    name,
    className = '',
    icon = '',
    edited = false,
    added = false,
    onMouseEnter = (e) => {},
    onMouseLeave = (e) => {},
    onRegionMouseEnter = (e, region:Regions) => {},
    onRegionMouseLeave = (e, region:Regions) => {},
    onDragBegin = (e) => {},
    mouseRegionCount = 1,
    disableHoverEffect = false,
}:TreeNodeProps) {
    const nodeRef = useRef<HTMLDivElement>(null);
    const rect = nodeRef.current?.getBoundingClientRect();
    const [lastHoverRegion, setLastHoverRegion] = useState<Regions>(Regions.None);
    const [mouseDown, setMouseDown] = useState(false);
    const [dragging, setDragging] = useState(false);

    const hoverClassName = useMemo(()=>{
        if (lastHoverRegion === Regions.Top) return styles['top'];
        else if (lastHoverRegion === Regions.Bottom) return styles['bottom'];
        else if (lastHoverRegion === Regions.Center) return styles['any'];
        else return undefined;
    }, [lastHoverRegion]);
    const getHoverRegion = useCallback((e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (mouseRegionCount === 0  || !rect) {
            return Regions.None;
        }
        else if (mouseRegionCount === 1) {
            return Regions.Center;
        }
        else if (mouseRegionCount === 2) {
            const y = e.clientY - rect.top;
            if (y < rect.height / 2) {
                return Regions.Top;
            }
            else {
                return Regions.Bottom;
            }
        }
        else {
            const y = e.clientY - rect.top;
            if (y < rect.height / 4) {
                return Regions.Top;
            }
            else if (y < rect.height * 3 / 4) {
                return Regions.Center;
            }
            else {
                return Regions.Bottom;
            }
        }

    }, [mouseRegionCount, rect]);

    const mouseEnter = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (dragging) return;
        if (!rect) return;

        const region = getHoverRegion(e);
        if (region !== Regions.None) {
            onMouseEnter(e);
            onRegionMouseEnter(e, region);
    
            setLastHoverRegion(region);
        }
    }
    const mouseLeave = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (dragging) return;
        if (!rect) return;

        onMouseLeave(e);
        onRegionMouseLeave(e, lastHoverRegion);
        
        setLastHoverRegion(Regions.None);
    }
    const mouseMove = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (dragging) return;

        if (mouseDown) {
            setDragging(true);
            onDragBegin(e);

            // leave event
            onMouseLeave(e);
            onRegionMouseLeave(e, lastHoverRegion);
            setLastHoverRegion(Regions.None);
        }
        else {
            const region = getHoverRegion(e);
            
            if (lastHoverRegion !== region) {
                onRegionMouseLeave(e, lastHoverRegion);
                onRegionMouseEnter(e, region);
                
                setLastHoverRegion(region);
            }
        }
    }

    useEffect(()=>{
        if (!mouseDown) return;

        const handleMouseUp = () => {
            setMouseDown(false);
            setDragging(false);
        };
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [mouseDown]);

    return (
        <div
            ref={nodeRef}
            className={
                classNames(
                    className,
                    styles['node'],
                    {
                        [styles['no-mouseaction']] : mouseRegionCount === 0,
                        [styles['edited']] : edited,
                        [styles['added']] : added,
                        [styles['disable-hover']] : disableHoverEffect,
                    },
                    hoverClassName,
                )
            }
            onMouseDown={(e)=>{
                setMouseDown(true);
            }}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            onMouseMove={mouseMove}
        >
            {
                icon !== '' && (
                    <GoogleFontIcon
                        value={icon}
                        style={{
                            top: '1px',
                        }}
                    />
                )
            }
            <span style={{paddingLeft:'0.25em'}}>{name}</span>
        </div>
    );
}