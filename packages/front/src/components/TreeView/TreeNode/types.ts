import React, { MouseEventHandler } from 'react';

export const Regions = {
    Top : 'Top',
    Center : 'Center',
    Bottom : 'Bottom',
    None : 'None',
    All : 'All',
} as const;
export type Regions = typeof Regions[keyof typeof Regions];

export type TreeNodeProps = {
    // name:string;

    className?:string;
    style?:React.CSSProperties;
    children?:React.ReactNode;

    onClick?:MouseEventHandler<HTMLDivElement>;
    onDoubleClick?:MouseEventHandler<HTMLDivElement>;
    onMouseEnter?:MouseEventHandler<HTMLDivElement>;
    onMouseLeave?:MouseEventHandler<HTMLDivElement>;
    onRegionMouseEnter?:(e:React.MouseEvent<HTMLDivElement, MouseEvent>, region:Regions)=>void;
    onRegionMouseLeave?:(e:React.MouseEvent<HTMLDivElement, MouseEvent>, region:Regions)=>void;

    onDragBegin?:MouseEventHandler<HTMLDivElement>;
    mouseRegionCount?:0|1|2|3;

    disableHoverEffect?:boolean;
}
