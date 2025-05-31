export type RTNodeTree = (RTNodeDirectory | RTNode)[];

export type RTNodeDirectory = {
    type: 'directory',
    name: string;
    children: RTNode[];
}
export type RTNode = {
    type: 'node';
    name: string;
    id : string;
}

export type RTTreeOffsets = [number]|[number, number];