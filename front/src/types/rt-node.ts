export type RTNodeTree = (RTNodeDirectory | RTNode)[];

export type RTNodeDirectory = {
    type: 'directory',
    name: string;
    children: RTNode[];
    added? : boolean;
    edited? : boolean;
}
export type RTNode = {
    type: 'node';
    name: string;
    id : string;
    added? : boolean;
    edited? : boolean;
}

export type RTTreeOffsets = [number]|[number, number];