import { VarMetadata } from "features/prompts";

export type VarEditorsProps = {
    className?: string;
    style?: React.CSSProperties;
    name?: string;
    item: VarMetadata;
    value: any;
    onChange: (x:any)=>void;
}
