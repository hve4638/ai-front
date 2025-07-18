export type ITreeNode<T=unknown> = ITreeDirectoryNode<T> | ITreeLeafNode<T>;

export interface ITreeDirectoryNode<T=unknown> {
    type: 'directory',
    name: string;
    value: T;
    children: ITreeLeafNode<T>[];
}
export interface ITreeLeafNode<T=unknown> {
    type: 'node'; 
    name: string;
    value: T;
}

export type TreeOffsets = [number]|[number, number];