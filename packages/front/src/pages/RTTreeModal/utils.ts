import { Tree, TreeDirectoryData } from './types';

type treeOffsets = [number]|[number, number];

/// @TODO : 현재 2계층까지 지원하므로 확장성을 위해 수정이 필요할 수 있음
export function relocateTree(tree:Tree, from:treeOffsets, to:treeOffsets):any[] {
    const result = [...tree];
    
    if (from.length === 1) {
        if (from[0] < to[0]) {
            to[0] -= 1;
        }
        else if (from[0] === to[0]) {
            return result;
        }
    }
    else {
        if (from[0] === to[0] && to.length === 2) {
            if (from[1] < to[1]) {
                to[1] -= 1;
            }
        }
    }
    
    let fromNode; 
    if (from.length === 1) {
        fromNode = result.splice(from[0], 1)[0];
    }
    else {
        const dir = result[from[0]] as TreeDirectoryData;
        fromNode = dir.children.splice(from[1], 1)[0];
    }
    
    if (to.length === 1) {
        result.splice(to[0], 0, fromNode);
    }
    else {
        const dir = result[to[0]] as TreeDirectoryData;
        dir.children.splice(to[1], 0, fromNode);
    }

    return result;
}