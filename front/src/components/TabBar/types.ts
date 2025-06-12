export type TabRequired = {
    name?:string;
    key:string;
}

export type TabRender<T> = (props:TabProps<T>)=>JSX.Element;

export type TabBarProps<T extends TabRequired, TRequired extends Partial<T> & TabRequired> = {
    focus:TRequired;
    items:T[];
    onChangeTabOrder:(items:T[])=>void;
    onAdd:()=>void;
    onFocus:(item:T, index:number)=>void;
    onRemove:(item:T, index:number)=>void;
    onUndoRemove:()=>void;
    enableHotkey?:boolean;
    tabRender:TabRender<T>;
}

export type TabProps<T> = {
    item:T
    widthPx : number;
    selected : boolean;
    onClick : () => void;
    onClose : () => void;
}