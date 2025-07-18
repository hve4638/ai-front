
export interface CommonDialogProps {
    title?:string;
    children?:React.ReactNode;
    enableRoundedBackground?:boolean

    className?:string;
    style?:React.CSSProperties;

    onClose:()=>void;
    isFocused:()=>boolean;
}
