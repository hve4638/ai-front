export type Tree = (TreeNodeData | TreeDirectoryData)[];

export type TreeDirectoryData = {
    type: 'directory',
    name: string;
    children: TreeNodeData[];
    added? : boolean;
    edited? : boolean;
    fixed? : boolean;
}
export type TreeNodeData = {
    type: 'node';
    name: string;
    added? : boolean;
    edited? : boolean;
    fixed? : boolean;
}

export type TreeOffsets = [number]|[number, number];